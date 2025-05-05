const express = require('express');
const router = express.Router();
const { redirectToYouTube, youtubeCallback } = require('../controllers/youtubeController');
const requireAuth = require('../middlewares/requireAuth');

router.get('/youtube', requireAuth, redirectToYouTube);
router.get('/youtube/callback', requireAuth, youtubeCallback);

module.exports = router;
