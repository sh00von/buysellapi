const express = require('express');
const router = express.Router();
const SingleToken = require('../models/SingleToken');
const Hall = require('../models/Hall');
const authenticate = require('../middleware/authMiddleware');

// Create a new single token (requires authentication)
router.post('/', authenticate, async (req, res) => {
  const { hallId, tokenDate, mealType, price, expiresAt } = req.body;
  const studentId = req.user._id; // Get studentId from authenticated user

  // Validate input
  if (!hallId || !tokenDate || !mealType || !price) {
    return res.status(400).json({ message: 'All required fields are missing' });
  }

  try {
    // Check if the hall exists
    const hall = await Hall.findById(hallId);
    if (!hall) {
      return res.status(404).json({ message: 'Hall not found' });
    }

    // Create a new single token
    const singleToken = new SingleToken({
      studentId,
      hallId,
      tokenDate,
      mealType,
      price,
      expiresAt,
    });

    const newSingleToken = await singleToken.save();
    res.status(201).json(newSingleToken);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all single tokens (requires authentication)
router.get('/', authenticate, async (req, res) => {
  try {
    const tokens = await SingleToken.find().populate('studentId').populate('hallId');
    res.json(tokens);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single token by ID (requires authentication)
router.get('/:id', authenticate, async (req, res) => {
  try {
    const token = await SingleToken.findById(req.params.id).populate('studentId').populate('hallId');
    if (!token) {
      return res.status(404).json({ message: 'Token not found' });
    }
    res.json(token);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a single token by ID (requires authentication)
router.put('/:id', authenticate, async (req, res) => {
  const { tokenDate, mealType, price, expiresAt, status } = req.body;

  try {
    const token = await SingleToken.findById(req.params.id);
    if (!token) {
      return res.status(404).json({ message: 'Token not found' });
    }

    // Update fields
    if (tokenDate) token.tokenDate = tokenDate;
    if (mealType) token.mealType = mealType;
    if (price) token.price = price;
    if (expiresAt) token.expiresAt = expiresAt;
    if (status) token.status = status;

    const updatedToken = await token.save();
    res.json(updatedToken);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a single token by ID (requires authentication)
router.delete('/:id', authenticate, async (req, res) => {
    try {
      const result = await SingleToken.findByIdAndDelete(req.params.id);
      if (!result) {
        return res.status(404).json({ message: 'Token not found' });
      }
      res.json({ message: 'Token deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

module.exports = router;
