const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true
    },
    type: {
      type: String,
      enum: {
       values: [
  'article_approved',
  'article_rejected',
  'changes_requested',
  'article_submitted',
  'quiz_created',
  'quiz_submitted',
  'quiz_attempted',
  'system'
],
        message: '{VALUE} is not a valid notification type'
      },
      default: 'system'
    },
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true
    },
    link: {
      type: String,
      default: '',
      trim: true
    },
    read: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  {
    timestamps: true
  }
);

notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

module.exports = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
