const express = require('express');
const router = express.Router();
const SingleToken = require('../models/SingleToken');

// Helper function to assign a composite priority score to each token
const computePriorityScore = (token) => {
  const statusPriority = {
    available: 2,
    requested: 3,
    booked: 4
  };

  const now = new Date();
  const daysUntilExpiration = (token.expiresAt - now) / (1000 * 60 * 60 * 24);
  const daysUntilExpirationScore = Math.max(0, 10 - daysUntilExpiration); // 10 is a max score for freshness

  const requestCount = token.requestedBy ? token.requestedBy.length : 0;
  const requestCountScore = Math.min(requestCount, 10); // Cap request count score

  return (statusPriority[token.status] || 0) * 10 + daysUntilExpirationScore + requestCountScore;
};

// Get all single tokens combined and prioritized, excluding expired tokens
router.get('/', async (req, res) => {
  try {
    const now = new Date();

    // Fetch all single tokens that are not expired
    const singleTokens = await SingleToken.find({ expiresAt: { $gte: now } })
      .populate('hallId')
      .exec();

    // Compute priority score and sort tokens by this score and tokenDate
    singleTokens.sort((a, b) => {
      const scoreA = computePriorityScore(a);
      const scoreB = computePriorityScore(b);
      if (scoreA !== scoreB) return scoreB - scoreA; // Higher score comes first
      return new Date(b.tokenDate) - new Date(a.tokenDate); // Fallback to date sorting
    });

    res.json(singleTokens);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
