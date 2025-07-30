const express = require('express');
const { authenticateUser } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { addToWishlistSchema } = require('../schema/wishlistSchema');
const wishlistController = require('../controller/wishlist');

const router = express.Router();

// Get user wishlist
router.get('/', authenticateUser, wishlistController.getWishlist);

// Add product to wishlist (with validation)
router.post('/', authenticateUser, validate(addToWishlistSchema), wishlistController.addToWishlist);

// Remove product from wishlist
router.delete('/:productId', authenticateUser, wishlistController.removeFromWishlist);

// Check if product is in wishlist
router.get('/check/:productId', authenticateUser, wishlistController.isInWishlist);

module.exports = router;
