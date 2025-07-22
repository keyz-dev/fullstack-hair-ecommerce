const Joi = require('joi');

const serviceCreateSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().positive().required(),
  duration: Joi.number().integer().min(1).required(),
  image: Joi.string().uri().optional(),
  category: Joi.string().required(),
  staff: Joi.array().items(Joi.string()).optional(),
  isActive: Joi.boolean().optional(),
});

const serviceUpdateSchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  price: Joi.number().positive().optional(),
  duration: Joi.number().integer().min(1).optional(),
  image: Joi.string().uri().optional(),
  category: Joi.string().optional(),
  staff: Joi.array().items(Joi.string()).optional(),
  isActive: Joi.boolean().optional(),
});

module.exports = {
  serviceCreateSchema,
  serviceUpdateSchema,
}; 