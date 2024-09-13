const express = require('express');
const router = express.Router();
const MultipleToken = require('../models/MultipleToken');
const Hall = require('../models/Hall');
const authenticate = require('../middleware/authMiddleware');

// Create a new multiple token (requires authentication)
router.post('/', authenticate, async (req, res) => {
  const { hallId, startDate, endDate, startMealType, endMealType, totalTokens, price } = req.body;
  const studentId = req.user._id; // Get studentId from authenticated user

  // Validate input
  if (!hallId || !startDate || !endDate || !startMealType || !endMealType || !totalTokens || !price) {
    return res.status(400).json({ message: 'All required fields are missing' });
  }

  try {
    // Check if the hall exists
    const hall = await Hall.findById(hallId);
    if (!hall) {
      return res.status(404).json({ message: 'Hall not found' });
    }

    // Create a new multiple token
    const multipleToken = new MultipleToken({
      studentId,
      hallId,
      startDate,
      endDate,
      startMealType,
      endMealType,
      totalTokens,
      price,
    });

    const newMultipleToken = await multipleToken.save();
    res.status(201).json(newMultipleToken);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all multiple tokens (requires authentication)
router.get('/', authenticate, async (req, res) => {
  try {
    const tokens = await MultipleToken.find({ studentId: req.user._id })
      .populate('studentId', 'name email created_at updated_at')
      .populate('hallId', 'name')
      .exec();
    res.json(tokens);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single multiple token by ID (requires authentication)
router.get('/:id', authenticate, async (req, res) => {
  try {
    const token = await MultipleToken.findOne({ _id: req.params.id, studentId: req.user._id })
      .populate('studentId', 'name email created_at updated_at')
      .populate('hallId', 'name')
      .exec();
    if (!token) {
      return res.status(404).json({ message: 'Token not found' });
    }
    res.json(token);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a multiple token by ID (requires authentication)
router.put('/:id', authenticate, async (req, res) => {
  const { hallId, startDate, endDate, startMealType, endMealType, totalTokens, price } = req.body;

  try {
    const token = await MultipleToken.findOne({ _id: req.params.id, studentId: req.user._id });
    if (!token) {
      return res.status(404).json({ message: 'Token not found' });
    }

    // Update fields
    if (hallId) token.hallId = hallId;
    if (startDate) token.startDate = startDate;
    if (endDate) token.endDate = endDate;
    if (startMealType) token.startMealType = startMealType;
    if (endMealType) token.endMealType = endMealType;
    if (totalTokens) token.totalTokens = totalTokens;
    if (price) token.price = price;
    token.updatedAt = Date.now(); // Update timestamp

    const updatedToken = await token.save();
    res.json(updatedToken);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a multiple token by ID (requires authentication)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const result = await MultipleToken.findOneAndDelete({ _id: req.params.id, studentId: req.user._id });
    if (!result) {
      return res.status(404).json({ message: 'Token not found' });
    }
    res.json({ message: 'Token deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
