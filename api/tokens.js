const express = require('express');
const cors = require('cors');
const connectDB = require('../lib/dbConnect');
const tokenRoutes = require('../routes/tokens');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Use the token routes
app.use('/api/tokens', tokenRoutes);

module.exports = (req, res) => {
  app(req, res);
};
