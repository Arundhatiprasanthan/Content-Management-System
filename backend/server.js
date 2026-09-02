const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Mount Articles API Route (Ritik's Module)
const articleRoutes = require('./routes/articleRoutes');
app.use('/api/articles', articleRoutes);

// Optional module routes mounted safely if available from teammates
try {
  const authRoutes = require('./routes/authRoutes');
  app.use('/api/auth', authRoutes);
} catch (err) {}

try {
  const userRoutes = require('./routes/userRoutes');
  app.use('/api/users', userRoutes);
} catch (err) {}

try {
  const quizRoutes = require('./routes/quizRoutes');
  app.use('/api/quizzes', quizRoutes);
} catch (err) {}

try {
  const notificationRoutes = require('./routes/notificationRoutes');
  app.use('/api/notifications', notificationRoutes);
} catch (err) {}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Lumen CMS Backend (Articles & Content Module) is running' });
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
