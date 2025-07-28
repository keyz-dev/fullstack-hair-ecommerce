const Joi = require('joi');

const currencyCreateSchema = Joi.object({
  code: Joi.string().required().uppercase().trim(),
  name: Joi.string().required().trim(),
  symbol: Joi.string().required().trim(),
  exchangeRate: Joi.number().positive().required(),
  isBase: Joi.boolean().optional(),
  isActive: Joi.boolean().optional(),
  position: Joi.string().valid('before', 'after').optional(),
});

const currencyUpdateSchema = Joi.object({
  code: Joi.string().uppercase().trim().optional(),
  name: Joi.string().trim().optional(),
  symbol: Joi.string().trim().optional(),
  exchangeRate: Joi.number().positive().optional(),
  isBase: Joi.boolean().optional(),
  isActive: Joi.boolean().optional(),
  position: Joi.string().valid('before', 'after').optional(),
});

module.exports = {
  currencyCreateSchema,
  currencyUpdateSchema,
}; 