const mongoose = require('mongoose');

const postAnalyticsSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  platform: {
    type: String,
    enum: ['facebook', 'instagram', 'youtube', 'tiktok'],
    required: true
  },
  reach: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  shares: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PostAnalytics', postAnalyticsSchema);
