const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  extractedText: {
    type: String,
    required: true
  },
  analysis: {
    overallScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    atsScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    strengths: {
      type: [String],
      default: []
    },
    improvements: {
      type: [String],
      default: []
    },
    missingKeywords: {
      type: [String],
      default: []
    },
    resumeHighlights: {
      type: [String],
      default: []
    },
    actionPlan: {
      type: [String],
      default: []
    },
    suggestedHeadline: {
      type: String,
      default: ''
    }
  },
  jobDescription: {
    type: String,
    default: ''
  },
  jdMatchScore: {
    type: Number,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Resume', resumeSchema);
