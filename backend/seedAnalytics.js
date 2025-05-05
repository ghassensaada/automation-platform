const mongoose = require('mongoose');
require('dotenv').config();
const PostAnalytics = require('./models/PostAnalytics');

const userId = '681808641c146e2666e87ee3'; // Replace with actual user ID
const platforms = ['facebook', 'instagram', 'youtube', 'tiktok'];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const docs = [];

    for (let i = 0; i < 20; i++) {
      const platform = platforms[Math.floor(Math.random() * platforms.length)];
      docs.push({
        postId: new mongoose.Types.ObjectId(),
        user: userId,
        platform,
        reach: Math.floor(Math.random() * 1000),
        likes: Math.floor(Math.random() * 300),
        shares: Math.floor(Math.random() * 100),
        views: Math.floor(Math.random() * 2000),
        comments: Math.floor(Math.random() * 50),
        date: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000)
      });
    }

    await PostAnalytics.insertMany(docs);
    console.log('Fake analytics data seeded.');
    process.exit();
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exit(1);
  }
};

seed();
