const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const commentRoutes = require('./routes/commentRoutes');

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Health check endpoint
app.get('/health', (req, res) => {
  const isDbConnected = mongoose.connection && mongoose.connection.readyState === 1;
  res.status(200).json({
    status: 'OK',
    module: '2.1 Nandini — Comment & Discussion Module',
    database: isDbConnected ? 'MongoDB Connected' : 'Built-in Data Engine (Active)',
    timestamp: new Date().toISOString()
  });
});

// Root information endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Lumen Comment & Discussion Backend API is running',
    health: '/health',
    sampleEndpoint: '/api/articles/1/comments'
  });
});

// Mount Comment & Discussion API endpoints
app.use('/api/articles/:articleId/comments', commentRoutes);
app.use('/api/comments', commentRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'API Route Not Found' });
});

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 5001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/lumen_cms';

function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 Comment & Discussion API server running on port ${port}`);
    console.log(`📡 URL: http://localhost:${port}`);
    console.log(`💬 Comments API: http://localhost:${port}/api/articles/1/comments`);
    console.log(`🩺 Health Check: http://localhost:${port}/health`);
    console.log(`======================================================\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️ Port ${port} is in use (often macOS AirPlay on 5000). Trying port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });
}

if (require.main === module) {
  startServer(DEFAULT_PORT);

  // Attempt MongoDB connection asynchronously with a 2-second timeout (non-blocking)
  mongoose
    .connect(MONGO_URI, { serverSelectionTimeoutMS: 2000 })
    .then((conn) => {
      console.log(`✅ Connected to MongoDB: ${conn.connection.host}`);
    })
    .catch(() => {
      console.log(`ℹ️  MongoDB not detected on local port 27017.`);
      console.log(`⚡ Built-in data engine enabled — all Comment CRUD, Nested Replies, Likes & Reports are 100% active and functional!\n`);
    });
}

module.exports = app;
