const SocialConnection = require('../models/SocialConnection');

exports.connectPlatform = async (req, res) => {
  try {
    const { platform, accessToken, refreshToken, expiresAt, accountName } = req.body;

    const existing = await SocialConnection.findOneAndUpdate(
      { user: req.user._id, platform },
      { accessToken, refreshToken, expiresAt, accountName, connectedAt: new Date() },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: 'Platform connected', connection: existing });
  } catch (err) {
    res.status(500).json({ message: 'Connection failed', error: err.message });
  }
};

exports.getConnections = async (req, res) => {
  try {
    const connections = await SocialConnection.find({ user: req.user._id });
    res.json(connections);
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed', error: err.message });
  }
};

exports.disconnectPlatform = async (req, res) => {
  try {
    const platform = req.params.platform;
    await SocialConnection.deleteOne({ user: req.user._id, platform });
    res.json({ message: `Disconnected from ${platform}` });
  } catch (err) {
    res.status(500).json({ message: 'Disconnect failed', error: err.message });
  }
};
