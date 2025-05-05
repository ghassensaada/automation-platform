const express = require('express');
const router = express.Router();
const { redirectToTikTok, tiktokCallback } = require('../controllers/tiktokController');
const requireAuth = require('../middlewares/requireAuth');

router.get('/tiktok', requireAuth, redirectToTikTok);
router.get('/tiktok/callback', requireAuth, tiktokCallback);

module.exports = router;
