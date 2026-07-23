const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from root .env
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Connect directly without using the config
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cozyloops');
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

// Define Category schema directly in script
const categorySchema = new mongoose.Schema({
  name: String,
  description: String,
  image: String,
  publicId: String,
  isActive: { type: Boolean, default: true },
  productCount: { type: Number, default: 0 }
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);

const checkCategories = async () => {
  try {
    await connectDB();
    
    const categories = await Category.find({});
    console.log(`📊 Found ${categories.length} categories in database`);
    
    if (categories.length === 0) {
      console.log('❌ No categories found! Creating default categories...');
      
      const defaultCategories = [
        { name: 'Flowers', description: 'Beautiful handmade crochet flowers' },
        { name: 'Bouquets', description: 'Stunning crochet bouquets' },
        { name: 'Keychains', description: 'Adorable crochet keychains' },
        { name: 'Phone Charms', description: 'Cute phone charms' },
        { name: 'Plushies', description: 'Soft crochet plushies' },
        { name: 'Personalized Gifts', description: 'Custom crochet gifts' },
        { name: 'Home Decor', description: 'Beautiful home decor items' },
        { name: 'Bookmarks', description: 'Unique crochet bookmarks' },
        { name: 'Custom Orders', description: 'Custom crochet creations' }
      ];
      
      for (const cat of defaultCategories) {
        await Category.create({
          ...cat,
          image: 'https://via.placeholder.com/400x400?text=Coming+Soon',
          publicId: 'placeholder',
          isActive: true,
          productCount: 0
        });
        console.log(`✅ Category "${cat.name}" created`);
      }
      console.log('🎉 All default categories created!');
    } else {
      categories.forEach(cat => {
        console.log(`📂 ${cat.name}: ${cat.description} (${cat.productCount || 0} products)`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkCategories();