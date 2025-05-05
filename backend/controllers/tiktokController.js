const axios = require('axios');
const SocialConnection = require('../models/SocialConnection');
require('dotenv').config();

exports.redirectToTikTok = (req, res) => {
  const redirectUri = process.env.TIKTOK_REDIRECT_URI;
  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const scope = 'user.info.basic,video.list,video.upload';

  const authUrl = \`https://www.tiktok.com/v2/auth/authorize/?client_key=\${clientKey}&response_type=code&scope=\${scope}&redirect_uri=\${encodeURIComponent(redirectUri)}&state=secure_random_string\`;

  res.redirect(authUrl);
};

exports.tiktokCallback = async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).send('TikTok OAuth failed: missing code');

  try {
    const tokenRes = await axios.post('https://open.tiktokapis.com/v2/oauth/token', null, {
      params: {
        client_key: process.env.TIKTOK_CLIENT_KEY,
        client_secret: process.env.TIKTOK_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.TIKTOK_REDIRECT_URI,
      },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const accessToken = tokenRes.data.data.access_token;

    const userInfo = await axios.get('https://open.tiktokapis.com/v2/user/info/', {
      headers: {
        Authorization: \`Bearer \${accessToken}\`
      }
    });

    const username = userInfo.data.data.user.username;

    await SocialConnection.findOneAndUpdate(
      { user: req.user.id, platform: 'tiktok' },
      { accountName: username, accessToken },
      { upsert: true, new: true }
    );

    res.redirect('/connections');
  } catch (err) {
    console.error('TikTok OAuth failed:', err.message);
    res.status(500).send('TikTok connection failed');
  }
};
