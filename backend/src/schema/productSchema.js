const Joi = require('joi');
const { imageArraySchema } = require("../utils/imageUtils");


const productCreateSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().positive().required(),
  productImages: imageArraySchema,
  category: Joi.string().required(),
  stock: Joi.number().integer().min(0).required(),
  service: Joi.string().optional(),
  isActive: Joi.boolean().optional(),
});

const productUpdateSchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  price: Joi.number().positive().optional(),
  productImages: imageArraySchema,
  category: Joi.string().optional(),
  stock: Joi.number().integer().min(0).optional(),
  service: Joi.string().optional(),
  isActive: Joi.boolean().optional(),
});

module.exports = {
  productCreateSchema,
  productUpdateSchema,
}; 