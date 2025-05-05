const axios = require('axios');
const SocialConnection = require('../models/SocialConnection');
require('dotenv').config();

exports.redirectToTwitter = (req, res) => {
  const redirectUri = process.env.TWITTER_REDIRECT_URI;
  const clientId = process.env.TWITTER_CLIENT_ID;
  const scope = 'tweet.read tweet.write users.read offline.access';

  const authUrl = \`https://twitter.com/i/oauth2/authorize?response_type=code&client_id=\${clientId}&redirect_uri=\${encodeURIComponent(redirectUri)}&scope=\${encodeURIComponent(scope)}&state=secure_random_string&code_challenge=challenge&code_challenge_method=plain\`;

  res.redirect(authUrl);
};

exports.twitterCallback = async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).send('Missing code');

  try {
    const tokenRes = await axios.post('https://api.twitter.com/2/oauth2/token', new URLSearchParams({
      code,
      grant_type: 'authorization_code',
      client_id: process.env.TWITTER_CLIENT_ID,
      redirect_uri: process.env.TWITTER_REDIRECT_URI,
      code_verifier: 'challenge'
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + Buffer.from(\`\${process.env.TWITTER_CLIENT_ID}:\${process.env.TWITTER_CLIENT_SECRET}\`).toString('base64')
      }
    });

    const accessToken = tokenRes.data.access_token;

    const profileRes = await axios.get('https://api.twitter.com/2/users/me', {
      headers: {
        Authorization: \`Bearer \${accessToken}\`
      }
    });

    const accountName = profileRes.data.data.username;

    await SocialConnection.findOneAndUpdate(
      { user: req.user.id, platform: 'x' },
      { accountName, accessToken },
      { upsert: true, new: true }
    );

    res.redirect('/connections');
  } catch (err) {
    console.error('Twitter OAuth failed:', err.message);
    res.status(500).send('Twitter connection failed');
  }
};
