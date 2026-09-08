const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

// =========================
// LOAD ENVIRONMENT VARIABLES
// =========================

dotenv.config({
  path: path.join(__dirname, ".env"),
});

const app = express();

// =========================
// MIDDLEWARE
// =========================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// =========================
// ARTICLE ROUTES
// =========================

const articleRoutes = require("./routes/articleRoutes");

app.use("/api/articles", articleRoutes);

// =========================
// SEARCH ROUTES (Ritik's Module)
// =========================

const searchRoutes = require("./routes/searchRoutes");

app.use("/api/search", searchRoutes);

// =========================
// ADMIN ROUTES
// =========================

try {
  const adminRoutes = require("./routes/adminRoutes");
  app.use("/api/admin", adminRoutes);
} catch (err) {}

// =========================
// AUTH ROUTES
// =========================

try {
  const authRoutes = require("./routes/authRoutes");
  app.use("/api/auth", authRoutes);
} catch (err) {}

// =========================
// USER ROUTES
// =========================

try {
  const userRoutes = require("./routes/userRoutes");
  app.use("/api/users", userRoutes);
} catch (err) {}

// =========================
// QUIZ ROUTES
// =========================

try {
  const quizRoutes = require("./routes/quizRoutes");
  app.use("/api/quizzes", quizRoutes);
} catch (err) {}

// =========================
// NOTIFICATION ROUTES
// =========================

try {
  const notificationRoutes = require("./routes/notificationRoutes");
  app.use("/api/notifications", notificationRoutes);
} catch (err) {}

// =========================
// HEALTH CHECK
// =========================

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Lumen CMS Backend (Articles & Search Module) is running",
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