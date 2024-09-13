const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

// Hash password before saving
studentSchema.pre('save', async function (next) {
  if (!this.isModified('password_hash')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password_hash = await bcrypt.hash(this.password_hash, salt);
    this.updated_at = Date.now(); // Update the timestamp
    next();
  } catch (err) {
    next(err);
  }
});

// Update timestamp before updating the document
studentSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updated_at: Date.now() });
  next();
});

// Method to compare passwords
studentSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password_hash);
};

// Exclude password hash from JSON output
studentSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password_hash; // Remove password_hash from the response
    return ret;
  }
});

module.exports = mongoose.model('Student', studentSchema);
