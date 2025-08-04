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
  firstName: Joi.string().min(2).max(30).required(),
  lastName: Joi.string().min(2).max(30).required(),
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
  firstName: Joi.string().min(2).max(30).optional(),
  lastName: Joi.string().min(2).max(30).optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().custom(phoneValidation, 'phone validation').optional()
    .messages({
      'any.invalid': 'Please provide a valid phone number with country code'
    }),
  dateOfBirth: Joi.date().max('now').optional(),
  gender: Joi.string().valid('male', 'female', 'other', 'prefer-not-to-say').optional(),
  bio: Joi.string().max(500).optional(),
  preferences: Joi.object({
    notifications: Joi.object({
      email: Joi.boolean().default(true),
      sms: Joi.boolean().default(false),
      push: Joi.boolean().default(true)
    }).optional(),
    privacy: Joi.object({
      profileVisibility: Joi.string().valid('public', 'private', 'friends').default('public'),
      showEmail: Joi.boolean().default(false),
      showPhone: Joi.boolean().default(false)
    }).optional(),
    theme: Joi.string().valid('light', 'dark', 'auto').default('auto').optional(),
    language: Joi.string().default('en').optional(),
    currency: Joi.string().default('XAF').optional()
  }).optional()
});

const userPasswordUpdateSchema = Joi.object({
  oldPassword: Joi.string().min(6).required(),
  newPassword: Joi.string().min(6).required(),
});

const userPreferencesSchema = Joi.object({
  preferences: Joi.object({
    notifications: Joi.object({
      email: Joi.boolean(),
      sms: Joi.boolean(),
      push: Joi.boolean()
    }).optional(),
    privacy: Joi.object({
      profileVisibility: Joi.string().valid('public', 'private', 'friends'),
      showEmail: Joi.boolean(),
      showPhone: Joi.boolean()
    }).optional(),
    theme: Joi.string().valid('light', 'dark', 'auto').optional(),
    language: Joi.string().optional(),
    currency: Joi.string().optional()
  }).required()
});

module.exports = {
  userRegisterSchema,
  userLoginSchema,
  googleLoginSchema,
  userUpdateSchema,
  userPasswordUpdateSchema,
  userPreferencesSchema,
}; 