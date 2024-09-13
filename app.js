const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import CORS
const connectDB = require('./lib/dbConnect'); // Database connection

const app = express();

// Connect to MongoDB
connectDB();

// CORS options
const corsOptions = {
  origin: '*', // Allow all origins
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
};

// Middleware
app.use(cors(corsOptions)); // Use CORS middleware with options
app.use(bodyParser.json());

// Import Routes
const hallRoutes = require('./routes/halls');
const singleTokenRoutes = require('./routes/singleTokens');
const requestRoutes = require('./routes/requests');
const transactionRoutes = require('./routes/transactions');
const authRoutes = require('./routes/auth');
const tokenRoutes = require('./routes/tokens');

// Use Routes
app.use('/api/halls', hallRoutes);
app.use('/api/single-tokens', singleTokenRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tokens', tokenRoutes);

// Start server for local development
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
