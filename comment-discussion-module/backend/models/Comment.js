const mongoose = require('mongoose');

const reportSubSchema = new mongoose.Schema(
  {
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    reason: {
      type: String,
      enum: ['Spam', 'Harassment', 'Inappropriate Content', 'Misinformation', 'Other'],
      required: true
    },
    details: {
      type: String,
      trim: true,
      maxlength: 500,
      default: ''
    },
    reportedAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: true }
);

const commentSchema = new mongoose.Schema(
  {
    articleId: {
      type: String,
      required: [true, 'Article ID is required'],
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true
    },
    parentCommentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
      index: true
    },
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      trim: true,
      minlength: [1, 'Comment cannot be empty'],
      maxlength: [3000, 'Comment cannot exceed 3000 characters']
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    isEdited: {
      type: Boolean,
      default: false
    },
    editedAt: {
      type: Date,
      default: null
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    reports: [reportSubSchema],
    reportCount: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['Active', 'Flagged', 'Hidden'],
      default: 'Active',
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Compound indexes for query optimization
commentSchema.index({ articleId: 1, parentCommentId: 1, createdAt: -1 });
commentSchema.index({ articleId: 1, status: 1 });

module.exports = mongoose.models.Comment || mongoose.model('Comment', commentSchema);
