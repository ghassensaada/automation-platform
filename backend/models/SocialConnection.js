const mongoose = require('mongoose');

const socialConnectionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  platform: { type: String, enum: ['facebook', 'instagram', 'youtube', 'tiktok'], required: true },
  accountName: { type: String },
  accessToken: { type: String, required: true },
  refreshToken: { type: String },
  expiresAt: { type: Date },
  connectedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SocialConnection', socialConnectionSchema);
