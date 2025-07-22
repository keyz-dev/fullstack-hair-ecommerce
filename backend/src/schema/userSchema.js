const Joi = require('joi');

const userRegisterSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().optional(),
  avatar: Joi.string().uri().optional(),
  dob: Joi.date().optional(),
  gender: Joi.string().valid("male", "female", "other").optional(),
  address: Joi.string().optional(),
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
  phone: Joi.string().optional(),
  avatar: Joi.string().uri().optional(),
  dob: Joi.date().optional(),
  gender: Joi.string().valid("male", "female", "other").optional(),
  address: Joi.string().optional(),
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