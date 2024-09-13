const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const SingleToken = require('../models/SingleToken');
const authenticate = require('../middleware/authMiddleware');

// Confirm a request
router.post('/confirm', authenticate, async (req, res) => {
  const { request_id } = req.body;
  const sellerId = req.user._id; // Assuming seller is also authenticated as student

  if (!request_id) {
    return res.status(400).json({ message: 'Request ID is required' });
  }

  try {
    const request = await Request.findById(request_id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status === 'confirmed') {
      return res.status(400).json({ message: 'Request is already confirmed' });
    }

    if (request.tokenModel !== 'SingleToken') {
      return res.status(400).json({ message: 'Invalid token model' });
    }

    const token = await SingleToken.findById(request.token_id);
    if (!token) {
      return res.status(404).json({ message: 'Token not found' });
    }

    // Confirm the request
    request.status = 'confirmed';
    await request.save();

    // Update token status to 'booked'
    token.status = 'booked';
    await token.save();

    res.json({ message: 'Request confirmed', request });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all transactions
router.get('/', authenticate, async (req, res) => {
  try {
    const transactions = await Request.find()
      .populate('token_id')
      .populate('buyer_id');
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific transaction by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const transaction = await Request.findById(req.params.id)
      .populate('token_id')
      .populate('buyer_id');
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
