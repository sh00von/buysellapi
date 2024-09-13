const express = require('express');
const cors = require('cors');
const connectDB = require('../lib/dbConnect');
const singleTokenRoutes = require('../routes/singleTokens');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Use the single tokens routes
app.use('/api/single-tokens', singleTokenRoutes);

module.exports = (req, res) => {
  app(req, res);
};
