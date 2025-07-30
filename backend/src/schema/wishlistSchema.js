const Joi = require('joi');

exports.addToWishlistSchema = Joi.object({
  productId: Joi.string().required().length(24).hex().label('Product ID'),
}); 