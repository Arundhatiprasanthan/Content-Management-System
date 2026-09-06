const mongoose = require("mongoose");
const Subscription = require("../models/Subscription");
const User = require("../models/User");

// Subscribe to an author
const subscribeToAuthor = async (req, res) => {
  try {
    const { authorId } = req.params;
    const subscriberId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(authorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid author ID",
      });
    }

    if (subscriberId.toString() === authorId) {
      return res.status(400).json({
        success: false,
        message: "You cannot subscribe to yourself",
      });
    }

    const author = await User.findById(authorId);

    if (!author) {
      return res.status(404).json({
        success: false,
        message: "Author not found",
      });
    }

    if (author.role !== "Author") {
      return res.status(400).json({
        success: false,
        message: "Selected user is not an author",
      });
    }

    const existingSubscription = await Subscription.findOne({
      subscriber: subscriberId,
      author: authorId,
    });

    if (existingSubscription) {
      return res.status(409).json({
        success: false,
        message: "Already subscribed to this author",
      });
    }

    const subscription = await Subscription.create({
      subscriber: subscriberId,
      author: authorId,
    });

    return res.status(201).json({
      success: true,
      message: "Successfully subscribed to author",
      subscribed: true,
      data: subscription,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Already subscribed to this author",
      });
    }

    console.error("Subscribe error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to subscribe to author",
    });
  }
};

// Unsubscribe from an author
const unsubscribeFromAuthor = async (req, res) => {
  try {
    const { authorId } = req.params;
    const subscriberId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(authorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid author ID",
      });
    }

    const subscription = await Subscription.findOneAndDelete({
      subscriber: subscriberId,
      author: authorId,
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Successfully unsubscribed from author",
      subscribed: false,
    });
  } catch (error) {
    console.error("Unsubscribe error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to unsubscribe from author",
    });
  }
};

// Check subscription status
const getSubscriptionStatus = async (req, res) => {
  try {
    const { authorId } = req.params;
    const subscriberId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(authorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid author ID",
      });
    }

    const author = await User.findById(authorId).select("_id role");

    if (!author || author.role !== "Author") {
      return res.status(404).json({
        success: false,
        message: "Author not found",
      });
    }

    const subscription = await Subscription.findOne({
      subscriber: subscriberId,
      author: authorId,
    });

    return res.status(200).json({
      success: true,
      subscribed: !!subscription,
    });
  } catch (error) {
    console.error("Subscription status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get subscription status",
    });
  }
};

// Get current user's subscriptions
const getMySubscriptions = async (req, res) => {
  try {
     console.log("MY SUBSCRIPTIONS USER ID:", req.user._id);
    const subscriptions = await Subscription.find({
      subscriber: req.user._id,
    })
      .populate(
        "author",
        "name email profileImage bio role"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: subscriptions.length,
      data: subscriptions,
    });
  } catch (error) {
    console.error("Get subscriptions error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get subscriptions",
    });
  }
};

module.exports = {
  subscribeToAuthor,
  unsubscribeFromAuthor,
  getSubscriptionStatus,
  getMySubscriptions,
};