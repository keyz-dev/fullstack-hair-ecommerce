const Joi = require('joi');

const bookingCreateSchema = Joi.object({
  user: Joi.string().required(),
  staff: Joi.string().required(),
  service: Joi.string().required(),
  date: Joi.date().required(),
  time: Joi.string().required(),
  status: Joi.string().valid('pending', 'confirmed', 'completed', 'cancelled').optional(),
  notes: Joi.string().optional(),
});

module.exports = {
  bookingCreateSchema,
}; 