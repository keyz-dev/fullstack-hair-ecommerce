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

const userRegisterSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().custom(phoneValidation, 'phone validation').required()
    .messages({
      'any.invalid': 'Please provide a valid phone number with country code',
      'string.empty': 'Phone number is required'
    }),
  avatar: Joi.string().uri().optional(),
});

const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// Google Login Schema
const googleLoginSchema = Joi.object({
  access_token: Joi.string().required(),
});

const userUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(30).optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().custom(phoneValidation, 'phone validation').optional()
    .messages({
      'any.invalid': 'Please provide a valid phone number with country code'
    }),
  avatar: Joi.string().uri().optional(),
});

const userUpdatePasswordSchema = Joi.object({
  oldPassword: Joi.string().min(6).required(),
  newPassword: Joi.string().min(6).required(),
});

module.exports = {
  userRegisterSchema,
  userLoginSchema,
  googleLoginSchema,
  userUpdateSchema,
  userUpdatePasswordSchema,
}; 