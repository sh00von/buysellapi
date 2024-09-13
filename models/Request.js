const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  token_id: { type: mongoose.Schema.Types.ObjectId, refPath: 'tokenModel', required: true },
  tokenModel: { type: String, enum: ['SingleToken', 'MultipleToken'], required: true },
  buyer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  quantity: { type: Number, required: false }, // Make quantity optional
  status: { type: String, enum: ['pending', 'confirmed', 'rejected'], default: 'pending' },
  serialNumber: { type: Number, required: true }, // Ensure serialNumber is required
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Request', requestSchema);
