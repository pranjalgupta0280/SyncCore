const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/synccore');
    console.log(`[MongoDB] Connected to host: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB Error] Initial connection failure: ${error.message}`);
    process.exit(1);
  }
};

// Lifecycle Event Listeners
mongoose.connection.on('connected', () => {
  console.log('[MongoDB Lifecycle] Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
  console.error(`[MongoDB Lifecycle Error] Mongoose connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.warn('[MongoDB Lifecycle Warning] Mongoose disconnected from DB');
});

module.exports = connectDB;
