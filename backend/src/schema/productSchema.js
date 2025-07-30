const Joi = require('joi');
const { imageArraySchema } = require("../utils/imageUtils");

// Variant schema
const variantSchema = Joi.object({
  name: Joi.string().required(),
  options: Joi.array().items(Joi.string()).min(1).required(),
  required: Joi.boolean().default(false)
});

// Feature schema
const featureSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional(),
  icon: Joi.string().optional()
});

// Specifications schema
const specificationsSchema = Joi.object({
  length: Joi.string().optional(),
  texture: Joi.string().optional(),
  material: Joi.string().optional(),
  weight: Joi.string().optional(),
  density: Joi.string().optional(),
  capSize: Joi.string().optional(),
  hairType: Joi.string().optional(),
  origin: Joi.string().optional(),
  careInstructions: Joi.string().optional(),
  warranty: Joi.string().optional()
});

const productCreateSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().positive().required(),
  discount: Joi.number().min(0).max(100).default(0),
  currency: Joi.string().uppercase().default('XAF'),
  productImages: imageArraySchema,
  category: Joi.string().required(),
  stock: Joi.number().integer().min(0).required(),
  service: Joi.string().optional(),
  isActive: Joi.boolean().default(true),
  isFeatured: Joi.boolean().default(false),
  isOnSale: Joi.boolean().default(false),
  
  // New fields
  variants: Joi.alternatives().try(
    Joi.array().items(variantSchema),
    Joi.string() // For JSON string from form data
  ).optional(),
  specifications: Joi.alternatives().try(
    specificationsSchema,
    Joi.string() // For JSON string from form data
  ).optional(),
  features: Joi.alternatives().try(
    Joi.array().items(featureSchema),
    Joi.string() // For JSON string from form data
  ).optional(),
  tags: Joi.alternatives().try(
    Joi.array().items(Joi.string()),
    Joi.string().allow('', null) // For comma-separated string from form data
  ).optional().allow('', null),
  metaTitle: Joi.string().allow('', null).optional(),
  metaDescription: Joi.string().allow('', null).optional(),
});

const productUpdateSchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  price: Joi.number().positive().optional(),
  discount: Joi.number().min(0).max(100).optional(),
  currency: Joi.string().uppercase().optional(),
  productImages: imageArraySchema,
  existingImages: Joi.string().optional(), // JSON string of existing images
  category: Joi.string().optional(),
  stock: Joi.number().integer().min(0).optional(),
  service: Joi.string().optional(),
  isActive: Joi.boolean().optional(),
  isFeatured: Joi.boolean().optional(),
  isOnSale: Joi.boolean().optional(),
  
  // New fields
  variants: Joi.alternatives().try(
    Joi.array().items(variantSchema),
    Joi.string() // For JSON string from form data
  ).optional(),
  specifications: Joi.alternatives().try(
    specificationsSchema,
    Joi.string() // For JSON string from form data
  ).optional(),
  features: Joi.alternatives().try(
    Joi.array().items(featureSchema),
    Joi.string() // For JSON string from form data
  ).optional(),
  tags: Joi.alternatives().try(
    Joi.array().items(Joi.string()),
    Joi.string().allow('', null) // For comma-separated string from form data
  ).optional().allow('', null),
  metaTitle: Joi.string().allow('', null).optional(),
  metaDescription: Joi.string().allow('', null).optional(),
});

module.exports = {
  productCreateSchema,
  productUpdateSchema,
}; 