const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const Analytics = require('../models/Analytics');
const connectDB = require('../config/database');

const initAnalytics = async () => {
  try {
    await connectDB();
    
    const analyticsExists = await Analytics.findOne();
    if (!analyticsExists) {
      await Analytics.create({
        totalProducts: 0,
        totalVideos: 0,
        totalLikes: 0,
        totalComments: 0,
        totalCategories: 0,
        wishlistCount: 0,
        latestUploads: { products: [], videos: [] },
        dailyStats: []
      });
      console.log('✅ Analytics initialized');
    } else {
      console.log('ℹ️ Analytics already exists');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

initAnalytics();