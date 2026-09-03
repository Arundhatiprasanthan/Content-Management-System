const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ==========================================
// PROTECT
// Requires a valid JWT token
// ==========================================
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Please login.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "lumen_secret"
    );

    const user = await User.findById(decoded.id).select(
      "-password"
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists.",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("Authentication error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

// ==========================================
// OPTIONAL AUTH
// Allows both logged-in and logged-out users
// ==========================================
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // No token → continue as guest
    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      req.user = null;
      return next();
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "lumen_secret"
    );

    const user = await User.findById(decoded.id).select(
      "-password"
    );

    req.user = user || null;

    next();
  } catch (error) {
    // Invalid token should not block optional-auth routes
    req.user = null;
    next();
  }
};

// ==========================================
// AUTHORIZE
// Checks user's role
// ==========================================
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized.",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message:
          "You do not have permission to perform this action.",
      });
    }

    next();
  };
};

// ==========================================
// EXPORTS
// ==========================================
module.exports = {
  protect,
  optionalAuth,
  authorize,
};