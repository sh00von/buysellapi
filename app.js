// app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors
const connectDB = require('./lib/dbConnect'); // Import the connection function
const cronJobs = require('./cronJobs'); // Import cron jobs

const app = express();

// Connect to MongoDB
connectDB();

// CORS options
const corsOptions = {
  origin: '*', // Allow all origins (use specific URLs in production)
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
};

// Middleware
app.use(cors(corsOptions)); // Use cors middleware with options
app.use(bodyParser.json());

// Import Routes
const hallRoutes = require('./routes/halls');
const singleTokenRoutes = require('./routes/singleTokens');
// const multipleTokenRoutes = require('./routes/multipleTokens');
const requestRoutes = require('./routes/requests');
const transactionRoutes = require('./routes/transactions');
const authRoutes = require('./routes/auth'); // Import authentication routes
app.use("/admin", require("./admin"))
const tokenRoutes = require('./routes/tokens'); // Import token routes
// Use Routes
// app.use('/api/students', studentRoutes);
app.use('/api/halls', hallRoutes);
app.use('/api/single-tokens', singleTokenRoutes);
// app.use('/api/multiple-tokens', multipleTokenRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/auth', authRoutes); // Use authentication routes

app.use('/api/tokens', tokenRoutes); // Use token routes
// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
module.exports = app;
