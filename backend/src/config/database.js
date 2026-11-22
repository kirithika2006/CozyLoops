const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    const error = new Error('MONGODB_URI is required.');
    error.code = 'MISSING_MONGODB_URI';
    throw error;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DB_NAME || 'Cozyloops21'
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}, database: ${conn.connection.name}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error(`MongoDB connection error (${err.name}).`);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    return conn;
  }  catch (error) {
  console.error('MongoDB Connection Failed');
  console.error('Name:', error.name);
  console.error('Code:', error.code);
  console.error('CodeName:', error.codeName);
  console.error('Message:', error.message);

  throw error;
}

};

module.exports = connectDB;
