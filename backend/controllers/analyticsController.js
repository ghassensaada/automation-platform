const PostAnalytics = require('../models/PostAnalytics');

// Get summary analytics for logged-in user
exports.getAnalyticsSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    const summary = await PostAnalytics.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$platform',
          totalReach: { $sum: '$reach' },
          totalLikes: { $sum: '$likes' },
          totalShares: { $sum: '$shares' },
          totalViews: { $sum: '$views' },
          totalComments: { $sum: '$comments' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({ status: 'ok', data: summary });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch analytics', error: err.message });
  }
};
