const express = require('express');
const cors = require('cors');
const connectDB = require('../lib/dbConnect');
const adminRouter = require('../admin'); // Import your admin router

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Use the AdminJS routes
app.use('/admin', adminRouter); // AdminJS dashboard

module.exports = (req, res) => {
  app(req, res);
};
