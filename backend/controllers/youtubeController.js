const axios = require('axios');
const qs = require('querystring');
const SocialConnection = require('../models/SocialConnection');
require('dotenv').config();

exports.redirectToYouTube = (req, res) => {
  const redirectUri = process.env.YT_REDIRECT_URI;
  const clientId = process.env.YT_CLIENT_ID;
  const scope = [
    'https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/youtube.readonly'
  ].join(' ');

  const authUrl = \`https://accounts.google.com/o/oauth2/v2/auth?client_id=\${clientId}&redirect_uri=\${redirectUri}&response_type=code&scope=\${encodeURIComponent(scope)}&access_type=offline&prompt=consent\`;

  res.redirect(authUrl);
};

exports.youtubeCallback = async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).send('Missing code');

  try {
    const tokenRes = await axios.post('https://oauth2.googleapis.com/token', qs.stringify({
      code,
      client_id: process.env.YT_CLIENT_ID,
      client_secret: process.env.YT_CLIENT_SECRET,
      redirect_uri: process.env.YT_REDIRECT_URI,
      grant_type: 'authorization_code'
    }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const accessToken = tokenRes.data.access_token;

    const profileRes = await axios.get('https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true', {
      headers: {
        Authorization: \`Bearer \${accessToken}\`
      }
    });

    const accountName = profileRes.data.items[0].snippet.title;

    await SocialConnection.findOneAndUpdate(
      { user: req.user.id, platform: 'youtube' },
      { accountName, accessToken },
      { upsert: true, new: true }
    );

    res.redirect('/connections');
  } catch (err) {
    console.error('YouTube OAuth failed:', err.message);
    res.status(500).send('YouTube connection failed');
  }
};
