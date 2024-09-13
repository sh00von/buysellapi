// routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Request = require('../models/Request');
const SingleToken = require('../models/SingleToken');
const MultipleToken = require('../models/MultipleToken');
const authenticate = require('../middleware/authMiddleware'); // Ensure authentication middleware is used
require('dotenv').config(); // Load environment variables

// Retrieve JWT secret key from environment variables
const JWT_SECRET = process.env.JWT_SECRET;

// Signup route
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await Student.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const newUser = new Student({
      name,
      email,
      password_hash: password,
    });

    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await Student.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user details, including profile, transactions, and requests
router.get('/me', authenticate, async (req, res) => {
  try {
    // Fetch user profile
    const user = await Student.findById(req.user._id).select('-password_hash');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch user requests
    const requests = await Request.find({ buyer_id: req.user._id })
      .populate('token_id')
      .populate('buyer_id');

    // Fetch user transactions
    const transactions = await Request.find({ buyer_id: req.user._id, status: 'confirmed' })
      .populate('token_id')
      .populate('buyer_id');

    // Fetch single tokens related to the user
    const singleTokens = await SingleToken.find({ studentId: req.user._id })
      .populate('hallId');

    // Fetch multiple tokens related to the user (if applicable)
    const multipleTokens = await MultipleToken.find({ studentId: req.user._id });

    // Combine all data
    const userDetails = {
      profile: user,
      requests,
      transactions,
      singleTokens,
      multipleTokens
    };

    res.json(userDetails);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
