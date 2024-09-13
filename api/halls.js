const express = require('express');
const cors = require('cors');
const connectDB = require('../lib/dbConnect');
const hallRoutes = require('../routes/halls'); // Import the routes

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Use the hall routes
app.use('/api/hall', hallRoutes);

module.exports = (req, res) => {
  app(req, res);
};
