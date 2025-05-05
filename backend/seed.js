const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Post = require('./models/Post');
const PostAnalytics = require('./models/PostAnalytics');
const SocialConnection = require('./models/SocialConnection');
const bcrypt = require('bcryptjs');

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear collections
    await User.deleteMany();
    await Post.deleteMany();
    await PostAnalytics.deleteMany();
    await SocialConnection.deleteMany();

    const password = await bcrypt.hash('password123', 10);

    // Create demo users
    const user1 = await User.create({ name: 'Quran Scapes AI', email: 'quran@example.com', password });
    const user2 = await User.create({ name: 'Quote Scapes AI', email: 'quote@example.com', password });

    // Create posts
    const post1 = await Post.create({ user: user1._id, content: 'Quran Daily 1', platform: 'instagram', mediaUrl: '', scheduledAt: new Date() });
    const post2 = await Post.create({ user: user2._id, content: 'Motivational Quote', platform: 'facebook', mediaUrl: '', scheduledAt: new Date() });

    // Create analytics
    await PostAnalytics.insertMany([
      {
        user: user1._id,
        postId: post1._id,
        platform: 'instagram',
        reach: 500,
        likes: 123,
        shares: 10,
        views: 800,
        comments: 12,
        date: new Date()
      },
      {
        user: user2._id,
        postId: post2._id,
        platform: 'facebook',
        reach: 1000,
        likes: 300,
        shares: 25,
        views: 1200,
        comments: 22,
        date: new Date()
      }
    ]);

    // Create social connections
    await SocialConnection.insertMany([
      { user: user1._id, platform: 'facebook', accountName: 'Quran Scapes AI', accessToken: 'FAKE_TOKEN_1' },
      { user: user1._id, platform: 'instagram', accountName: 'Quran Scapes IG', accessToken: 'FAKE_TOKEN_2' },
      { user: user2._id, platform: 'facebook', accountName: 'Quote Scapes FB', accessToken: 'FAKE_TOKEN_3' }
    ]);

    console.log('🌱 Demo data seeded successfully');
    process.exit();
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
};

run();
