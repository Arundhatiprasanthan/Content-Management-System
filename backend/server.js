const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const articleRoutes = require('./routes/articleRoutes');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Mount Article Routes
app.use('/api/articles', articleRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Lumen CMS Backend is running' });
});

// Error handling middleware for unknown routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'API Route Not Found' });
});

const PORT = process.env.PORT || 5000;

// Connect DB and start server if executed directly
if (require.main === module) {
  connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
