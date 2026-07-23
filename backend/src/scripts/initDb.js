const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const Category = require('../models/Category');
const Analytics = require('../models/Analytics');
const connectDB = require('../config/database');

// Load environment variables
dotenv.config({ path: '../../.env' });

const initializeDatabase = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Initialize Admin
    const adminExists = await Admin.findOne({ username: 'CozyLoops21' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('Cozy@21', 10);
      await Admin.create({
        username: 'CozyLoops21',
        password: hashedPassword,
        isAdmin: true,
        lastLogin: null
      });
      console.log('✅ Admin created successfully');
    } else {
      console.log('ℹ️ Admin already exists');
    }

    // Initialize Categories
    const categories = [
      { name: 'Flowers', description: 'Beautiful handmade crochet flowers perfect for any occasion' },
      { name: 'Bouquets', description: 'Stunning crochet bouquets that never wilt' },
      { name: 'Keychains', description: 'Adorable crochet keychains to accessorize your keys' },
      { name: 'Phone Charms', description: 'Cute phone charms to personalize your device' },
      { name: 'Plushies', description: 'Soft and cuddly crochet plushies for all ages' },
      { name: 'Personalized Gifts', description: 'Custom crochet gifts made just for you' },
      { name: 'Home Decor', description: 'Beautiful crochet items to decorate your home' },
      { name: 'Bookmarks', description: 'Unique crochet bookmarks for book lovers' },
      { name: 'Custom Orders', description: 'Commission your own custom crochet creation' }
    ];

    for (const cat of categories) {
      const existing = await Category.findOne({ name: cat.name });
      if (!existing) {
        await Category.create({
          ...cat,
          image: 'https://via.placeholder.com/400x400?text=Coming+Soon',
          publicId: 'placeholder',
          isActive: true,
          productCount: 0
        });
        console.log(`✅ Category "${cat.name}" created`);
      } else {
        console.log(`ℹ️ Category "${cat.name}" already exists`);
      }
    }

    // Initialize Analytics
    const analyticsExists = await Analytics.findOne();
    if (!analyticsExists) {
      await Analytics.create({
        totalProducts: 0,
        totalVideos: 0,
        totalLikes: 0,
        totalComments: 0,
        totalCategories: categories.length,
        wishlistCount: 0,
        latestUploads: { products: [], videos: [] },
        dailyStats: []
      });
      console.log('✅ Analytics initialized');
    } else {
      console.log('ℹ️ Analytics already exists');
    }

    console.log('🎉 Database initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
};

initializeDatabase();