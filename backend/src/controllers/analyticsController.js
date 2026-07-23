const Analytics = require('../models/Analytics');
const Product = require('../models/Product');
const Video = require('../models/Video');
const Category = require('../models/Category');
const Comment = require('../models/Comment');
const Like = require('../models/Like');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

// @desc    Get analytics
// @route   GET /api/analytics
// @access  Private
const getAnalytics = catchAsync(async (req, res, next) => {
  try {
    // Get or create analytics document
    let analytics = await Analytics.findOne();
    
    if (!analytics) {
      analytics = await Analytics.create({
        totalProducts: 0,
        totalVideos: 0,
        totalCategories: 0,
        totalComments: 0,
        totalLikes: 0,
        wishlistCount: 0,
        latestUploads: { products: [], videos: [] },
        dailyStats: []
      });
    }

    // Get real-time stats
    const [totalProducts, totalVideos, totalCategories, totalComments, totalLikes] = await Promise.all([
      Product.countDocuments(),
      Video.countDocuments({ isActive: true }),
      Category.countDocuments({ isActive: true }),
      Comment.countDocuments(),
      Like.countDocuments()
    ]);

    // Get latest uploads - using lean() to avoid virtual issues
    const latestProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean()
      .select('name images price createdAt');

    const latestVideos = await Video.find({ isActive: true })
      .sort({ uploadedAt: -1 })
      .limit(5)
      .lean()
      .select('title thumbnail duration uploadedAt');

    // Update analytics
    analytics.totalProducts = totalProducts;
    analytics.totalVideos = totalVideos;
    analytics.totalCategories = totalCategories;
    analytics.totalComments = totalComments;
    analytics.totalLikes = totalLikes;
    analytics.latestUploads = {
      products: latestProducts || [],
      videos: latestVideos || []
    };
    analytics.updatedAt = new Date();
    await analytics.save();

    res.status(200).json({
      success: true,
      analytics: {
        totalProducts,
        totalVideos,
        totalCategories,
        totalComments,
        totalLikes,
        totalWishlist: analytics.wishlistCount || 0,
        latestUploads: {
          products: latestProducts || [],
          videos: latestVideos || []
        },
        dailyStats: analytics.dailyStats || [],
        updatedAt: analytics.updatedAt
      }
    });
  } catch (error) {
    console.error('Error in getAnalytics:', error);
    // Return default analytics if something fails
    res.status(200).json({
      success: true,
      analytics: {
        totalProducts: 0,
        totalVideos: 0,
        totalCategories: 0,
        totalComments: 0,
        totalLikes: 0,
        totalWishlist: 0,
        latestUploads: { products: [], videos: [] },
        dailyStats: [],
        updatedAt: new Date()
      }
    });
  }
});

// @desc    Update analytics (increment views)
// @route   POST /api/analytics/view
// @access  Private
const trackView = catchAsync(async (req, res, next) => {
  const { type, id } = req.body;

  if (type === 'product') {
    await Product.findByIdAndUpdate(id, { $inc: { views: 1 } });
  } else if (type === 'video') {
    await Video.findByIdAndUpdate(id, { $inc: { views: 1 } });
  }

  // Update daily stats
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let analytics = await Analytics.findOne();
  if (!analytics) {
    analytics = await Analytics.create({ dailyStats: [] });
  }

  const todayStat = analytics.dailyStats.find(
    stat => new Date(stat.date).toDateString() === today.toDateString()
  );

  if (todayStat) {
    todayStat.views += 1;
  } else {
    analytics.dailyStats.push({
      date: today,
      views: 1,
      likes: 0,
      comments: 0
    });
  }

  await analytics.save();

  res.status(200).json({
    success: true,
    message: 'View tracked successfully'
  });
});

// @desc    Get daily stats
// @route   GET /api/analytics/daily
// @access  Private
const getDailyStats = catchAsync(async (req, res, next) => {
  const days = parseInt(req.query.days) || 7;
  
  const analytics = await Analytics.findOne();
  if (!analytics) {
    return res.status(200).json({
      success: true,
      stats: []
    });
  }

  // Get last N days
  const now = new Date();
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - days);

  const stats = analytics.dailyStats
    .filter(stat => new Date(stat.date) >= cutoff)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  res.status(200).json({
    success: true,
    stats
  });
});

module.exports = {
  getAnalytics,
  trackView,
  getDailyStats
};