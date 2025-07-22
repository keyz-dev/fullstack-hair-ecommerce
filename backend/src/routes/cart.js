const express = require('express');
const { authenticateUser } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { cartAddItemSchema, cartUpdateItemSchema } = require('../schema/cartSchema');
const cartController = require('../controller/cart');

const router = express.Router();

router.get('/', authenticateUser, cartController.getCart);
router.post('/add', authenticateUser, validate(cartAddItemSchema), cartController.addToCart);
router.put('/update', authenticateUser, validate(cartUpdateItemSchema), cartController.updateCartItem);
router.delete('/remove', authenticateUser, validate(cartUpdateItemSchema), cartController.removeFromCart);

module.exports = router; 