const mongoose = require('mongoose');
const dns = require('dns');

// Ensure reliable DNS SRV resolution for MongoDB Atlas on Windows networks
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore DNS override errors if in constrained environment
}

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lumen_cms';
    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`⚠️ Database connection error: ${error.message}`);
    console.log('💡 Check MONGO_URI in backend/.env');
  }
};

module.exports = connectDB;
