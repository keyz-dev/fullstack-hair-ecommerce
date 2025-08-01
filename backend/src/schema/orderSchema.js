const Joi = require('joi');
const { validatePhoneNumber } = require('../utils/phoneValidation');

// Custom phone validation
const phoneValidation = (value, helpers) => {
  const validation = validatePhoneNumber(value);
  if (!validation.isValid) {
    return helpers.error('any.invalid');
  }
  return value;
};

const orderCreateSchema = Joi.object({
  user: Joi.string().optional().allow(null, ''),
  // Guest customer info (required when user is not provided)
  customerInfo: Joi.object({
    firstName: Joi.string().min(2).max(50).required()
      .messages({
        'string.empty': 'First name is required',
        'string.min': 'First name must be at least 2 characters',
        'string.max': 'First name cannot exceed 50 characters'
      }),
    lastName: Joi.string().min(2).max(50).required()
      .messages({
        'string.empty': 'Last name is required',
        'string.min': 'Last name must be at least 2 characters',
        'string.max': 'Last name cannot exceed 50 characters'
      }),
    email: Joi.string().email().required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'string.empty': 'Email is required'
      }),
    phone: Joi.string().custom(phoneValidation, 'phone validation').required()
      .messages({
        'any.invalid': 'Please provide a valid phone number with country code',
        'string.empty': 'Phone number is required'
      })
  }).when('user', {
    is: Joi.exist(),
    then: Joi.optional().allow(null, ''),
    otherwise: Joi.required()
  }),
  cartItems: Joi.array().items(
    Joi.object({
      product: Joi.string().required(),
      variant: Joi.object().optional(),
      quantity: Joi.number().integer().min(1).required(),
      price: Joi.number().positive().required(),
    })
  ).min(1).required(),
  paymentMethod: Joi.string().required()
    .messages({
      'string.empty': 'Payment method is required',
      'any.required': 'Payment method is required'
    }),
  subtotal: Joi.number().positive().required(),
  shipping: Joi.number().min(0).required(),
  tax: Joi.number().min(0).required(),
  processingFee: Joi.number().min(0).required(),
  total: Joi.number().positive().required(),
  notes: Joi.string().allow('').optional(),
  shippingAddress: Joi.object({
    address: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    postalCode: Joi.string().required(),
    country: Joi.string().required(),
  }).required(),
});

module.exports = {
  orderCreateSchema,
}; 