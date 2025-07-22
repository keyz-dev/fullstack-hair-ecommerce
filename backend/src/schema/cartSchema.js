const Joi = require('joi');

const cartAddItemSchema = Joi.object({
  product: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required(),
});

const cartUpdateItemSchema = Joi.object({
  product: Joi.string().required(),
  quantity: Joi.number().integer().min(0).required(), // 0 to remove
});

module.exports = {
  cartAddItemSchema,
  cartUpdateItemSchema,
}; 