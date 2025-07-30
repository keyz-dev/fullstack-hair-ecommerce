
const express = require('express');
const { authenticateUser, authorizeRoles } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { reviewCreateSchema } = require('../schema/reviewSchema');
const reviewController = require('../controller/review');

const router = express.Router();

// Create a review for a product
router.post('/:productId', authenticateUser, validate(reviewCreateSchema), reviewController.createReview);

// Get all reviews for a product (paginated)
router.get('/:productId', reviewController.getProductReviews);

// Update a review (by reviewId)
router.put('/update/:reviewId', authenticateUser, reviewController.updateReview);

// Delete a review (by reviewId)
router.delete('/delete/:reviewId', authenticateUser, reviewController.deleteReview);

// Mark review as helpful
router.post('/helpful/:reviewId', authenticateUser, reviewController.markReviewHelpful);

// Admin: verify review
router.patch('/verify/:reviewId', authenticateUser, authorizeRoles(['admin' ]), reviewController.verifyReview);

module.exports = router;
