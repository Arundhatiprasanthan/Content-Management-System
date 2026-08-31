const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true
  },
  options: {
    type: [String],
    validate: {
      validator: function (val) {
        return Array.isArray(val) && val.length >= 2;
      },
      message: 'A question must have at least 2 options'
    },
    required: [true, 'Options are required']
  },
  correctAnswer: {
    type: Number,
    required: [true, 'Correct answer index is required'],
    min: [0, 'Correct answer index must be at least 0']
  },
  explanation: {
    type: String,
    trim: true,
    default: ''
  }
});

const quizSchema = new mongoose.Schema(
  {
    articleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Article',
      required: [true, 'Article ID is required']
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author ID is required']
    },
    title: {
      type: String,
      trim: true,
      default: 'Article Quiz'
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    questions: {
      type: [questionSchema],
      validate: {
        validator: function (val) {
          return Array.isArray(val) && val.length > 0;
        },
        message: 'Quiz must contain at least one question'
      }
    },
    status: {
      type: String,
      enum: {
        values: ['Draft', 'Published', 'Archived'],
        message: '{VALUE} is not a valid quiz status'
      },
      default: 'Published'
    }
  },
  {
    timestamps: true
  }
);

quizSchema.index({ articleId: 1, status: 1 });
quizSchema.index({ authorId: 1 });

module.exports = mongoose.models.Quiz || mongoose.model('Quiz', quizSchema);
