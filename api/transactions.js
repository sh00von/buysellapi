const express = require('express');
const cors = require('cors');
const connectDB = require('../lib/dbConnect');
const transactionRoutes = require('../routes/transactions');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Use the transactions routes
app.use('/api/transactions', transactionRoutes);

module.exports = (req, res) => {
  app(req, res);
};
