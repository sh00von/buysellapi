// models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  token_id: { type: mongoose.Schema.Types.ObjectId, refPath: 'tokenModel', required: true },
  tokenModel: { type: String, enum: ['SingleToken', 'MultipleToken'], required: true },
  buyer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  seller_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  quantity: { type: Number, required: true },
  total_price: { type: Number, required: true },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Transaction', transactionSchema);
