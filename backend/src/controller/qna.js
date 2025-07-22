const QnA = require('../models/qna');
const { BadRequestError, NotFoundError } = require('../utils/errors');

// Ask a question
exports.askQuestion = async (req, res, next) => {
  try {
    const qna = await QnA.create(req.body);
    res.status(201).json({ success: true, qna });
  } catch (err) {
    next(err);
  }
};

// Answer a question
exports.answerQuestion = async (req, res, next) => {
  try {
    const qna = await QnA.findByIdAndUpdate(
      req.params.id,
      { answer: req.body.answer, answeredBy: req.body.answeredBy, isAnswered: true },
      { new: true }
    );
    if (!qna) return next(new NotFoundError('Question not found'));
    res.json({ success: true, qna });
  } catch (err) {
    next(err);
  }
};

// Get all QnA for a product/service
exports.getQnAForTarget = async (req, res, next) => {
  try {
    const qnas = await QnA.find({ target: req.params.targetId }).populate('user answeredBy');
    res.json({ success: true, qnas });
  } catch (err) {
    next(err);
  }
}; 