const Joi = require('joi');

const paymentMethodCreateSchema = Joi.object({
  name: Joi.string().required().trim(),
  code: Joi.string().required().uppercase().trim(),
  description: Joi.string().trim().optional(),
  icon: Joi.string().trim().optional().allow(null, ''),
  isActive: Joi.boolean().optional(),
  isOnline: Joi.boolean().optional(),
  requiresSetup: Joi.boolean().optional(),
  supportedCurrencies: Joi.array().items(Joi.string().uppercase()).optional(),
  fees: Joi.number().min(0).optional(),
  minAmount: Joi.number().min(0).optional(),
  maxAmount: Joi.number().min(0).optional().allow(null),
  sortOrder: Joi.number().integer().optional(),
});

const paymentMethodUpdateSchema = Joi.object({
  name: Joi.string().trim().optional(),
  code: Joi.string().uppercase().trim().optional(),
  description: Joi.string().trim().optional(),
  icon: Joi.string().trim().optional().allow(null, ''),
  isActive: Joi.boolean().optional(),
  isOnline: Joi.boolean().optional(),
  requiresSetup: Joi.boolean().optional(),
  supportedCurrencies: Joi.array().items(Joi.string().uppercase()).optional(),
  fees: Joi.number().min(0).optional(),
  minAmount: Joi.number().min(0).optional(),
  maxAmount: Joi.number().min(0).optional().allow(null),
  sortOrder: Joi.number().integer().optional(),
});

module.exports = {
  paymentMethodCreateSchema,
  paymentMethodUpdateSchema,
}; 