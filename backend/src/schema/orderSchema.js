const Joi = require('joi');

const orderCreateSchema = Joi.object({
  user: Joi.string().optional().allow(null,''),
  // Guest customer info (required when user is not provided)
  customerInfo: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required()
  }).when('user', {
    is: Joi.exist(),
    then: Joi.optional(),
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
  paymentMethod: Joi.string().required(),
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