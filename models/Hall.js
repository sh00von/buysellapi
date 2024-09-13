// models/Hall.js
const mongoose = require('mongoose');

const hallSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

module.exports = mongoose.model('Hall', hallSchema);
