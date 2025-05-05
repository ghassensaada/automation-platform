const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  mediaUrl: { type: String },
  platform: { type: String, enum: ['facebook', 'instagram', 'youtube', 'tiktok'], required: true },
  scheduledAt: { type: Date, required: true },
  postedAt: { type: Date },
  status: { type: String, enum: ['scheduled', 'posted', 'failed'], default: 'scheduled' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', postSchema);
