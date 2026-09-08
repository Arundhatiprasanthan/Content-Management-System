const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Article title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Article description is required'],
      trim: true
    },
    content: {
      type: String,
      required: [true, 'Article content is required']
    },
    coverImage: {
      type: String,
      default: ''
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author ID is required']
    },
    category: {
      type: String,
      required: [true, 'Article category is required'],
      enum: {
        values: ['Science', 'Technology', 'Environment', 'Health', 'History', 'Other'],
        message: '{VALUE} is not a valid category'
      },
      default: 'Other'
    },
    tags: [
      {
        type: String,
        trim: true
      }
    ],
    status: {
      type: String,
      required: [true, 'Article status is required'],
      enum: {
        values: ['Draft', 'Pending Review', 'Changes Requested', 'Published', 'Rejected'],
        message: '{VALUE} is not a valid article status'
      },
      default: 'Draft'
    },
    readingTime: {
      type: Number,
      default: 1
    },
    submittedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Compound indexes for searching and filtering
articleSchema.index({ status: 1, category: 1, createdAt: -1 });
articleSchema.index({ authorId: 1, status: 1 });
articleSchema.index({ title: 'text', description: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('Article', articleSchema);
