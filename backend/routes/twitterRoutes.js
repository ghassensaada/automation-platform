const express = require('express');
const router = express.Router();
const { redirectToTwitter, twitterCallback } = require('../controllers/twitterController');
const requireAuth = require('../middlewares/requireAuth');

router.get('/x', requireAuth, redirectToTwitter);
router.get('/x/callback', requireAuth, twitterCallback);

module.exports = router;
