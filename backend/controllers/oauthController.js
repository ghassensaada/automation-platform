const axios = require('axios');
const SocialConnection = require('../models/SocialConnection');
require('dotenv').config();

exports.redirectToFacebook = (req, res) => {
  const redirectUri = process.env.FB_REDIRECT_URI;
  const clientId = process.env.FB_CLIENT_ID;
  const scope = 'pages_show_list,pages_manage_posts,instagram_basic,instagram_content_publish';
  const fbAuthUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;

  res.redirect(fbAuthUrl);
};

exports.facebookCallback = async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).send('No code returned');

  try {
    const tokenRes = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
      params: {
        client_id: process.env.FB_CLIENT_ID,
        client_secret: process.env.FB_CLIENT_SECRET,
        redirect_uri: process.env.FB_REDIRECT_URI,
        code
      }
    });

    const accessToken = tokenRes.data.access_token;

    const fbUserRes = await axios.get('https://graph.facebook.com/me?fields=name,email&access_token=' + accessToken);
    const userName = fbUserRes.data.name;

    // Save Facebook connection
    await SocialConnection.findOneAndUpdate(
      { user: req.user.id, platform: 'facebook' },
      { accountName: userName, accessToken },
      { upsert: true, new: true }
    );

    // Get pages connected to this FB user
    const pagesRes = await axios.get('https://graph.facebook.com/me/accounts?access_token=' + accessToken);
    const pages = pagesRes.data.data;

    for (const page of pages) {
      const pageToken = page.access_token;

      // Get linked Instagram account
      const igRes = await axios.get(\`https://graph.facebook.com/\${page.id}?fields=connected_instagram_account&access_token=\${pageToken}\`);
      const igAccount = igRes.data.connected_instagram_account;

      if (igAccount && igAccount.id) {
        // Get IG username
        const igInfoRes = await axios.get(\`https://graph.facebook.com/\${igAccount.id}?fields=username&access_token=\${pageToken}\`);
        const igUsername = igInfoRes.data.username;

        // Save Instagram connection
        await SocialConnection.findOneAndUpdate(
          { user: req.user.id, platform: 'instagram' },
          { accountName: igUsername, accessToken: pageToken },
          { upsert: true, new: true }
        );

        break; // only add first IG connection found
      }
    }

    res.redirect('/connections');
  } catch (err) {
    console.error('Facebook/Instagram OAuth failed:', err.message);
    res.status(500).send('Facebook/Instagram connection failed');
  }
};
