const mongoose = require('mongoose');

const singleTokenSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  hallId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hall', required: true },
  tokenDate: { type: Date, required: true },
  mealType: { type: String, enum: ['lunch', 'dinner'], required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: ['available', 'requested', 'booked', 'expired'], default: 'available' },
  requestedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }], // Changed to an array to handle multiple requests
  expiresAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

// Static method to update expired tokens
singleTokenSchema.statics.updateExpiredTokens = async function () {
  const now = new Date();
  return this.updateMany({ expiresAt: { $lt: now }, status: { $ne: 'expired' } }, { status: 'expired' });
};

// Instance method to handle new request
singleTokenSchema.methods.handleRequest = async function (studentId) {
  if (this.status === 'booked') {
    throw new Error('Token is already booked');
  }

  if (this.status === 'requested' && this.requestedBy.includes(studentId)) {
    throw new Error('You have already requested this token');
  }

  // If the token is available and has no requests, change status to requested
  if (this.status === 'available' && this.requestedBy.length === 0) {
    this.status = 'requested';
  }

  // Add the request
  this.requestedBy.push(studentId);
  await this.save();
};

module.exports = mongoose.model('SingleToken', singleTokenSchema);
