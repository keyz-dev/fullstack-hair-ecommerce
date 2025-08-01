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

const initiatePaymentSchema = Joi.object({
  orderId: Joi.string().required()
    .messages({
      'string.empty': 'Order ID is required',
      'any.required': 'Order ID is required'
    }),
  phoneNumber: Joi.string().custom(phoneValidation, 'phone validation').required()
    .messages({
      'any.invalid': 'Please provide a valid phone number with country code',
      'string.empty': 'Phone number is required',
      'any.required': 'Phone number is required'
    })
});

const paymentInfoSchema = Joi.object({
  paymentMethod: Joi.string().required()
    .messages({
      'string.empty': 'Payment method is required',
      'any.required': 'Payment method is required'
    }),
  // Dynamic validation based on payment method
  mobileNumber: Joi.when('paymentMethod', {
    is: Joi.string().valid('MOBILE_MONEY', 'mobile_money').insensitive(),
    then: Joi.string().custom(phoneValidation, 'phone validation').required()
      .messages({
        'any.invalid': 'Please provide a valid mobile number with country code',
        'string.empty': 'Mobile number is required for mobile money payment',
        'any.required': 'Mobile number is required for mobile money payment'
      }),
    otherwise: Joi.optional()
  }),
  phoneNumber: Joi.when('paymentMethod', {
    is: Joi.string().valid('MOBILE_MONEY', 'mobile_money').insensitive(),
    then: Joi.string().custom(phoneValidation, 'phone validation').required()
      .messages({
        'any.invalid': 'Please provide a valid phone number with country code',
        'string.empty': 'Phone number is required for mobile money payment',
        'any.required': 'Phone number is required for mobile money payment'
      }),
    otherwise: Joi.optional()
  }),
  phone: Joi.when('paymentMethod', {
    is: Joi.string().valid('MOBILE_MONEY', 'mobile_money').insensitive(),
    then: Joi.string().custom(phoneValidation, 'phone validation').required()
      .messages({
        'any.invalid': 'Please provide a valid phone number with country code',
        'string.empty': 'Phone number is required for mobile money payment',
        'any.required': 'Phone number is required for mobile money payment'
      }),
    otherwise: Joi.optional()
  }),
  // Bank transfer fields
  accountNumber: Joi.when('paymentMethod', {
    is: Joi.string().valid('BANK_TRANSFER', 'bank_transfer').insensitive(),
    then: Joi.string().required()
      .messages({
        'string.empty': 'Account number is required for bank transfer',
        'any.required': 'Account number is required for bank transfer'
      }),
    otherwise: Joi.optional()
  }),
  accountName: Joi.when('paymentMethod', {
    is: Joi.string().valid('BANK_TRANSFER', 'bank_transfer').insensitive(),
    then: Joi.string().required()
      .messages({
        'string.empty': 'Account name is required for bank transfer',
        'any.required': 'Account name is required for bank transfer'
      }),
    otherwise: Joi.optional()
  })
});

module.exports = {
  initiatePaymentSchema,
  paymentInfoSchema
}; 