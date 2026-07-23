const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Import models
const Admin = require('../models/Admin');
const connectDB = require('../config/database');

const createAdmin = async () => {
  try {
    await connectDB();
    
    // Check if admin exists
    const adminExists = await Admin.findOne({ username: 'CozyLoops21' });
    if (adminExists) {
      console.log('ℹ️ Admin already exists');
      console.log('Username:', adminExists.username);
      console.log('Password: Cozy@21 (default)');
      
      // Optionally reset password
      const reset = await Admin.findOne({ username: 'CozyLoops21' });
      reset.password = 'Cozy@21';
      await reset.save();
      console.log('✅ Password reset to: Cozy@21');
      
      process.exit(0);
    }

    // Create new admin
    const hashedPassword = await bcrypt.hash('Cozy@21', 10);
    await Admin.create({
      username: 'CozyLoops21',
      password: hashedPassword,
      isAdmin: true,
      lastLogin: null
    });
    
    console.log('✅ Admin created successfully!');
    console.log('📝 Username: CozyLoops21');
    console.log('📝 Password: Cozy@21');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

createAdmin();