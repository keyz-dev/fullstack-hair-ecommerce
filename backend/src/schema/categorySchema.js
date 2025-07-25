const Joi = require('joi');

const categoryCreateSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  categoryImage: Joi.string().optional(),
});

const categoryUpdateSchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  categoryImage: Joi.string().optional(),
});

module.exports = {
  categoryCreateSchema,
  categoryUpdateSchema,
}; 