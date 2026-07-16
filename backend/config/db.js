const mongoose = require('mongoose');
const User = require('../models/User');
const Quiz = require('../models/Quiz');
const Room = require('../models/Room');
const Result = require('../models/Result');

const connectDB = async () => {
  try {
    const connString = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!connString) {
      console.warn('⚠️ MONGODB_URI or MONGO_URI is not set. Please check your environment configuration.');
      return;
    }
    
    const conn = await mongoose.connect(connString);
    console.log(`
  💾 MongoDB Connected Successfully!
  =========================================
  📡 Database Host: ${conn.connection.host}
  🔌 Connection State: Connected
  =========================================
    `);
  } catch (error) {
    console.error(`❌ MongoDB connection failure: ${error.message}`);
    process.exit(1);
  }
};

const db = {
  users: User,
  quizzes: Quiz,
  rooms: Room,
  results: Result
};

module.exports = { connectDB, db };
