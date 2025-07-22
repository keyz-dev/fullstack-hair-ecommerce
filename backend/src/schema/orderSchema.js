const Joi = require('joi');

const orderCreateSchema = Joi.object({
  user: Joi.string().required(),
  orderItems: Joi.array().items(
    Joi.object({
      product: Joi.string().required(),
      quantity: Joi.number().integer().min(1).required(),
      unitPrice: Joi.number().positive().required(),
    })
  ).min(1).required(),
  shippingAddress: Joi.object({
    city: Joi.string().required(),
    street: Joi.string().optional(),
    postalCode: Joi.string().optional(),
    state: Joi.string().optional(),
    country: Joi.string().optional(),
  }).required(),
  paymentMethod: Joi.string().valid('cash_on_delivery', 'credit_card', 'paypal', 'stripe').required(),
  paymentStatus: Joi.string().valid('pending', 'paid', 'failed').optional(),
  status: Joi.string().valid('pending', 'accepted', 'ready', 'delivered', 'cancelled').optional(),
  totalAmount: Joi.number().positive().required(),
  booking: Joi.string().optional(),
});

module.exports = {
  orderCreateSchema,
}; 