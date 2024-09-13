const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./lib/dbConnect');
const adminRouter = require('./admin'); // Import AdminJS router

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
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Use AdminJS Router
app.use('/admin', adminRouter); // AdminJS routes, mounted at "/admin"

// Define routes
const hallRoutes = require('./routes/halls');
const singleTokenRoutes = require('./routes/singleTokens');
// const multipleTokenRoutes = require('./routes/multipleTokens');
const requestRoutes = require('./routes/requests');
const transactionRoutes = require('./routes/transactions');
const authRoutes = require('./routes/auth');
const tokenRoutes = require('./routes/tokens');

// Use Routes
app.use('/api/halls', hallRoutes);
app.use('/api/single-tokens', singleTokenRoutes);
// app.use('/api/multiple-tokens', multipleTokenRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tokens', tokenRoutes);

// Export the app for serverless deployment
module.exports = app;
