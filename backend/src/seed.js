const connectDB = require('./config/database');
const Admin = require('./models/Admin');
const Category = require('./models/Category');
const dotenv = require('dotenv');

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();

    // Check if admin exists
    const adminExists = await Admin.findOne({ username: 'CozyLoops21' });
    if (!adminExists) {
      await Admin.create({
        username: 'CozyLoops21',
        password: 'Cozy@21'
      });
      console.log('Admin created successfully');
    }

    // Create default categories if none exist
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
      const exists = await Category.findOne({ name: cat.name });
      if (!exists) {
        await Category.create({
          ...cat,
          image: 'https://via.placeholder.com/400x400?text=Coming+Soon',
          publicId: 'placeholder'
        });
        console.log(`Category "${cat.name}" created`);
      }
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();