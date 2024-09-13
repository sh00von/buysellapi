const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const SingleToken = require('../models/SingleToken');
const authenticate = require('../middleware/authMiddleware');

// Function to get the next serial number
const getNextSerialNumber = async (token_id) => {
  const latestRequest = await Request.findOne({ token_id }).sort({ serialNumber: -1 });
  return latestRequest ? latestRequest.serialNumber + 1 : 1;
};

// Create a new request (requires authentication)
router.post('/create', authenticate, async (req, res) => {
  const { token_id } = req.body;
  const studentId = req.user._id; // Get studentId from authenticated user

  // Validate input
  if (!token_id) {
    return res.status(400).json({ message: 'Token ID is required' });
  }

  try {
    // Check if the token is a SingleToken
    const token = await SingleToken.findById(token_id);
    if (!token) {
      return res.status(404).json({ message: 'Token not found' });
    }

    // Check if the token is already requested
    const existingRequest = await Request.findOne({ token_id, status: 'pending' });
    if (existingRequest) {
      return res.status(400).json({ message: 'This token has already been requested' });
    }

    // Get the next serial number
    const serialNumber = await getNextSerialNumber(token_id);

    // Create a new request
    const request = new Request({
      token_id,
      tokenModel: 'SingleToken',
      buyer_id: studentId,
      quantity: 1, // Default quantity for single token
      serialNumber,
    });

    const newRequest = await request.save();

    // Initialize requestedBy array if it is null
    if (!token.requestedBy) {
      token.requestedBy = [];
    }
    // Add student to requestedBy array
    if (!token.requestedBy.includes(studentId)) {
      token.requestedBy.push(studentId);
    }
    // Update token status to 'requested'
    token.status = 'requested';
    await token.save();

    res.status(201).json(newRequest);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Remove a request (requires authentication)
router.post('/remove', authenticate, async (req, res) => {
  const { token_id } = req.body;
  const studentId = req.user._id; // Get studentId from authenticated user

  // Validate input
  if (!token_id) {
    return res.status(400).json({ message: 'Token ID is required' });
  }

  try {
    // Find the request
    const request = await Request.findOne({ token_id, buyer_id: studentId, status: 'pending' });
    
    // If request is not found
    if (!request) {
      console.log(`Request not found: token_id=${token_id}, buyer_id=${studentId}`);
      return res.status(404).json({ message: 'Request not found' });
    }

    // Delete the request
    await Request.findByIdAndDelete(request._id);

    // Update the token status and requestedBy
    const token = await SingleToken.findById(token_id);

    if (token) {
      if (!token.requestedBy) {
        token.requestedBy = [];
      }
      // Remove student from requestedBy array
      token.requestedBy = token.requestedBy.filter(id => id.toString() !== studentId.toString());
      // If no more requests, set status back to 'available'
      if (token.requestedBy.length === 0) {
        token.status = 'available';
      }
      await token.save();
    }

    res.json({ message: 'Request removed' });
  } catch (err) {
    console.error('Error in removing request:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// Get all requests for the authenticated user
router.get('/my-requests', authenticate, async (req, res) => {
  const studentId = req.user._id; // Get studentId from authenticated user

  try {
    // Find all requests where the buyer_id matches the authenticated user's ID
    const requests = await Request.find({ buyer_id: studentId }).populate('token_id').sort({ created_at: -1 });

    // Check if any requests are found
    if (requests.length === 0) {
      return res.status(404).json({ message: 'No requests found' });
    }

    // Send the list of requests in the response
    res.json(requests);
  } catch (err) {
    console.error('Error fetching requests:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// Get all requests for a specific token (requires authentication)
router.get('/all/:token_id', authenticate, async (req, res) => {
  const { token_id } = req.params;

  try {
    const requests = await Request.find({ token_id }).sort({ serialNumber: 1 }).populate('buyer_id');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
