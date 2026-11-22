const mongoose = require('mongoose');

const ownerOtpSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  otpHash: { type: String, required: true, select: false },
  expiresAt: { type: Date, required: true, expires: 0 },
  attempts: { type: Number, default: 0, min: 0 },
  lastSentAt: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('OwnerOtp', ownerOtpSchema);
