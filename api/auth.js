const express = require('express');
const cors = require('cors');
const connectDB = require('../lib/dbConnect');
const authRoutes = require('../routes/auth');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Use the authentication routes
app.use('/api/auth', authRoutes);

module.exports = (req, res) => {
  app(req, res);
};
