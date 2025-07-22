const Joi = require('joi');

const testimonialCreateSchema = Joi.object({
  user: Joi.string().required(),
  message: Joi.string().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  isApproved: Joi.boolean().optional(),
});

module.exports = {
  testimonialCreateSchema,
}; 