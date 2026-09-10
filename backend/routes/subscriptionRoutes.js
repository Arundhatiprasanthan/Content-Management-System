const express = require("express");

const router = express.Router();

const {
  subscribeToAuthor,
  unsubscribeFromAuthor,
  getSubscriptionStatus,
  getMySubscriptions,
} = require("../controllers/subscriptionController");

const { protect } = require("../middleware/authMiddleware");

// Get current user's subscriptions
router.get("/", protect, getMySubscriptions);

// Check whether current user follows an author
router.get(
  "/status/:authorId",
  protect,
  getSubscriptionStatus
);

// Subscribe
router.post(
  "/:authorId",
  protect,
  subscribeToAuthor
);

// Unsubscribe
router.delete(
  "/:authorId",
  protect,
  unsubscribeFromAuthor
);

module.exports = router;