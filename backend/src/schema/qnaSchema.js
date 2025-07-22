const Joi = require('joi');

const qnaAskSchema = Joi.object({
  user: Joi.string().required(),
  type: Joi.string().valid('product', 'service').required(),
  target: Joi.string().required(),
  question: Joi.string().required(),
});

const qnaAnswerSchema = Joi.object({
  answer: Joi.string().required(),
  answeredBy: Joi.string().required(),
});

module.exports = {
  qnaAskSchema,
  qnaAnswerSchema,
}; 