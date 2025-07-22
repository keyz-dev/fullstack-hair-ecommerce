const Joi = require('joi');

const notificationCreateSchema = Joi.object({
  user: Joi.string().required(),
  type: Joi.string().valid('order', 'booking', 'system', 'promotion').required(),
  message: Joi.string().required(),
  isRead: Joi.boolean().optional(),
});

module.exports = {
  notificationCreateSchema,
}; 