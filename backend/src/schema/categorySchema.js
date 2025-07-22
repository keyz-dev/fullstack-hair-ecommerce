const Joi = require('joi');

const categoryCreateSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.string().uri().optional(),
});

const categoryUpdateSchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  image: Joi.string().uri().optional(),
});

module.exports = {
  categoryCreateSchema,
  categoryUpdateSchema,
}; 