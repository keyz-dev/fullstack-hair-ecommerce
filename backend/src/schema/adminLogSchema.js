const Joi = require('joi');

const adminLogCreateSchema = Joi.object({
  admin: Joi.string().required(),
  action: Joi.string().required(),
  targetModel: Joi.string().required(),
  targetId: Joi.string().required(),
  details: Joi.string().optional(),
});

module.exports = {
  adminLogCreateSchema,
}; 