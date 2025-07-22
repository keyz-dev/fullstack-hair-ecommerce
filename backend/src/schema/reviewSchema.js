const Joi = require('joi');

const reviewCreateSchema = Joi.object({
  reviewer: Joi.string().required(),
  type: Joi.string().valid('product', 'service').required(),
  target: Joi.string().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().required(),
});

module.exports = {
  reviewCreateSchema,
}; 