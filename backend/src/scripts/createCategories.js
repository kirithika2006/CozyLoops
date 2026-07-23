const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const Category = require('../models/Category');
const connectDB = require('../config/database');

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

const createCategories = async () => {
  try {
    await connectDB();
    
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
    
    console.log('🎉 All categories created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

createCategories();