const express = require('express');
const router = express.Router();
const { redirectToFacebook, facebookCallback } = require('../controllers/oauthController');
const requireAuth = require('../middlewares/requireAuth');

router.get('/facebook', requireAuth, redirectToFacebook);
router.get('/facebook/callback', requireAuth, facebookCallback);

module.exports = router;
