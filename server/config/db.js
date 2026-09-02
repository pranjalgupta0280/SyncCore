const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`[MongoDB] Connected to cloud host: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[MongoDB Warning] Primary connection failed (${error.message}). Attempting local fallback...`);
    try {
      const localConn = await mongoose.connect('mongodb://127.0.0.1:27017/synccore');
      console.log(`[MongoDB] Connected to local host: ${localConn.connection.host}`);
    } catch (localErr) {
      console.error(`[MongoDB Error] Failed to connect to MongoDB: ${localErr.message}`);
      console.warn('[MongoDB] Server will run with in-memory / fallback state until MongoDB service is available.');
    }
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
