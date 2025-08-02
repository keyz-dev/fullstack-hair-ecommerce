const Joi = require('joi');

const serviceCreateSchema = Joi.object({
  name: Joi.string().min(2).max(100).required()
    .messages({
      'string.empty': 'Service name is required',
      'string.min': 'Service name must be at least 2 characters',
      'string.max': 'Service name cannot exceed 100 characters'
    }),
  
  description: Joi.string().min(10).max(1000).required()
    .messages({
      'string.empty': 'Service description is required',
      'string.min': 'Service description must be at least 10 characters',
      'string.max': 'Service description cannot exceed 1000 characters'
    }),
  
  basePrice: Joi.number().positive().required()
    .messages({
      'number.base': 'Base price must be a number',
      'number.positive': 'Base price must be positive',
      'any.required': 'Base price is required'
    }),
  
  currency: Joi.string().uppercase().optional(),
  
  pricing: Joi.alternatives().try(
    Joi.array().items(
      Joi.object({
        currency: Joi.string().uppercase().required(),
        price: Joi.number().positive().required(),
        isActive: Joi.boolean().default(true)
      })
    ),
    Joi.string().custom((value, helpers) => {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          return parsed;
        }
        return helpers.error('any.invalid');
      } catch (error) {
        return helpers.error('any.invalid');
      }
    }, 'json-array')
  ).optional(),
  
  duration: Joi.number().integer().min(1).max(480).required()
    .messages({
      'number.base': 'Duration must be a number',
      'number.integer': 'Duration must be a whole number',
      'number.min': 'Duration must be at least 1 minute',
      'number.max': 'Duration cannot exceed 480 minutes (8 hours)',
      'any.required': 'Duration is required'
    }),
  
  image: Joi.string().optional(),
  
  category: Joi.string().required()
    .messages({
      'string.empty': 'Category is required',
      'any.required': 'Category is required'
    }),
  
  staff: Joi.array().items(Joi.string()).optional(),
  
  requiresStaff: Joi.boolean().default(true),
  
  status: Joi.string().valid('draft', 'active', 'inactive', 'maintenance').default('draft'),
  
  specialInstructions: Joi.string().max(500).optional(),
  
  cancellationPolicy: Joi.string().max(500).optional(),
  
  tags: Joi.alternatives().try(
    Joi.array().items(Joi.string().max(50)),
    Joi.string().custom((value, helpers) => {
      if (Array.isArray(value)) {
        return value;
      }
      // Handle array format from FormData
      return value;
    }, 'array-handler')
  ).optional(),
  
  slug: Joi.string().max(100).optional(),
  
  metaTitle: Joi.string().max(60).optional(),
  
  metaDescription: Joi.string().max(160).optional(),
});

const serviceUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional()
    .messages({
      'string.min': 'Service name must be at least 2 characters',
      'string.max': 'Service name cannot exceed 100 characters'
    }),
  
  description: Joi.string().min(10).max(1000).optional()
    .messages({
      'string.min': 'Service description must be at least 10 characters',
      'string.max': 'Service description cannot exceed 1000 characters'
    }),
  
  basePrice: Joi.number().positive().optional()
    .messages({
      'number.base': 'Base price must be a number',
      'number.positive': 'Base price must be positive'
    }),
  
  pricing: Joi.alternatives().try(
    Joi.array().items(
      Joi.object({
        currency: Joi.string().uppercase().required(),
        price: Joi.number().positive().required(),
        isActive: Joi.boolean().default(true)
      })
    ),
    Joi.string().custom((value, helpers) => {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          return parsed;
        }
        return helpers.error('any.invalid');
      } catch (error) {
        return helpers.error('any.invalid');
      }
    }, 'json-array')
  ).optional(),
  
  duration: Joi.number().integer().min(1).max(480).optional()
    .messages({
      'number.base': 'Duration must be a number',
      'number.integer': 'Duration must be a whole number',
      'number.min': 'Duration must be at least 1 minute',
      'number.max': 'Duration cannot exceed 480 minutes (8 hours)'
    }),
  
  image: Joi.string().optional(),
  
  category: Joi.string().optional(),
  
  staff: Joi.array().items(Joi.string()).optional(),
  
  requiresStaff: Joi.boolean().optional(),
  
  status: Joi.string().valid('draft', 'active', 'inactive', 'maintenance').optional(),
  
  specialInstructions: Joi.string().max(500).optional(),
  
  cancellationPolicy: Joi.string().max(500).optional(),
  
  tags: Joi.alternatives().try(
    Joi.array().items(Joi.string().max(50)),
    Joi.string().custom((value, helpers) => {
      if (Array.isArray(value)) {
        return value;
      }
      // Handle array format from FormData
      return value;
    }, 'array-handler')
  ).optional(),
  
  slug: Joi.string().max(100).optional(),
  
  metaTitle: Joi.string().max(60).optional(),
  
  metaDescription: Joi.string().max(160).optional(),
});

module.exports = {
  serviceCreateSchema,
  serviceUpdateSchema,
}; 