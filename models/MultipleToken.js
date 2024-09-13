const mongoose = require('mongoose');

// Define the schema
const multipleTokenSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  hallId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hall', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  startMealType: { type: String, enum: ['lunch', 'dinner'], required: true },
  endMealType: { type: String, enum: ['lunch', 'dinner'], required: true },
  totalTokens: { type: Number, required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: ['available', 'requested', 'booked', 'expired'], default: 'available' },
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Middleware to update timestamp before saving
multipleTokenSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Static method to update expired tokens
multipleTokenSchema.statics.updateExpiredTokens = async function () {
  const now = new Date();
  // Find tokens that have passed their endDate and are not already marked as expired
  return this.updateMany(
    { endDate: { $lt: now }, status: { $ne: 'expired' } },
    { status: 'expired' }
  );
};

module.exports = mongoose.model('MultipleToken', multipleTokenSchema);
