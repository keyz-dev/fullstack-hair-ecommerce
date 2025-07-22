const mongoose = require('mongoose');

const qnaSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['product', 'service'],
    required: true,
  },
  target: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'type',
  },
  question: {
    type: String,
    required: true,
  },
  answer: String,
  answeredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  isAnswered: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('QnA', qnaSchema); 