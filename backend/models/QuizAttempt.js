const mongoose = require('mongoose');

const attemptAnswerSchema = new mongoose.Schema({
  questionIndex: {
    type: Number,
    required: true
  },
  question: {
    type: String,
    default: ''
  },
  selectedOption: {
    type: Number,
    default: null
  },
  isCorrect: {
    type: Boolean,
    required: true
  },
  explanation: {
    type: String,
    default: ''
  }
});

const quizAttemptSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: [true, 'Quiz ID is required']
    },
    articleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Article'
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required']
    },
    answers: [attemptAnswerSchema],
    score: {
      type: Number,
      default: 0,
      min: 0
    },
    total: {
      type: Number,
      default: 0,
      min: 0
    },
    percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    status: {
      type: String,
      enum: ['in-progress', 'completed'],
      default: 'completed'
    },
    startedAt: {
      type: Date,
      default: Date.now
    },
    submittedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

quizAttemptSchema.index({ userId: 1, quizId: 1, createdAt: -1 });
quizAttemptSchema.index({ quizId: 1, createdAt: -1 });

module.exports = mongoose.models.QuizAttempt || mongoose.model('QuizAttempt', quizAttemptSchema);
