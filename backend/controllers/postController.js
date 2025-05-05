const Post = require('../models/Post');

exports.createPost = async (req, res) => {
  try {
    const post = await Post.create({
      user: req.user._id,
      content: req.body.content,
      mediaUrl: req.body.mediaUrl,
      platform: req.body.platform,
      scheduledAt: req.body.scheduledAt
    });
    res.status(201).json({ message: 'Post scheduled', post });
  } catch (err) {
    res.status(500).json({ message: 'Create failed', error: err.message });
  }
};

exports.getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user._id }).sort({ scheduledAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed', error: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};
