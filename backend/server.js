const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config({
  path: path.join(__dirname, ".env"),
});

const app = express();

// =========================
// MIDDLEWARE
// =========================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// =========================
// ARTICLE ROUTES
// =========================
const articleRoutes = require("./routes/articleRoutes");
app.use("/api/articles", articleRoutes);

// =========================
// ADMIN ROUTES
// =========================
const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

// =========================
// AUTH ROUTES
// =========================
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// =========================
// USER ROUTES
// =========================
try {
  const userRoutes = require("./routes/userRoutes");
  app.use("/api/users", userRoutes);
} catch (err) {
  console.error("User routes could not be loaded:", err.message);
}

// =========================
// QUIZ ROUTES
// =========================
const quizRoutes = require("./routes/quizRoutes");
app.use("/api/quizzes", quizRoutes);

// =========================
// NOTIFICATION ROUTES
// =========================
try {
  const notificationRoutes = require("./routes/notificationRoutes");
  app.use("/api/notifications", notificationRoutes);
} catch (err) {
  console.error(
    "Notification routes could not be loaded:",
    err.message
  );
}

// =========================
// HEALTH CHECK
// =========================
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message:
      "Lumen CMS Backend (Articles & Content Module) is running",
  });
});

// =========================
// UNKNOWN ROUTES
// =========================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API Route Not Found",
  });
});

// =========================
// SERVER
// =========================
const PORT = process.env.PORT || 5000;

if (require.main === module) {
  connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;