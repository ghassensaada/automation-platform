const express = require('express');
const router = express.Router();
const path = require('path');
const { login, register, logout } = require('../controllers/authController');
const requireAuth = require('../middlewares/requireAuth');
const Post = require('../models/Post');

// Public Pages
router.get('/login', (req, res) => res.render('login'));
router.get('/register', (req, res) => res.render('register'));

// Auth Actions
router.post('/login', login);
router.post('/register', register);
router.get('/logout', logout);

// Protected Pages
router.get('/dashboard', requireAuth, (req, res) => {
  res.render('dashboard', { user: req.user });
});

router.get('/schedule', requireAuth, async (req, res) => {
  const posts = await Post.find({ user: req.user._id }).sort({ scheduledAt: -1 });
  res.render('schedule', { user: req.user, posts });
});

router.post('/schedule', requireAuth, async (req, res) => {
  const { content, platform, mediaUrl, scheduledAt } = req.body;
  await Post.create({ user: req.user._id, content, platform, mediaUrl, scheduledAt });
  res.redirect('/schedule');
});

router.post('/schedule/delete/:id', requireAuth, async (req, res) => {
  await Post.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  res.redirect('/schedule');
});

router.get('/analytics', requireAuth, (req, res) => {
  res.render('analytics', { user: req.user });
});

router.get('/ai-prompts', requireAuth, (req, res) => {
  res.render('ai-prompts', { user: req.user });
});

module.exports = router;
