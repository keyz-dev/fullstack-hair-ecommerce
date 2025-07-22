
const express = require('express');
const { authenticateUser } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { reviewCreateSchema } = require('../schema/reviewSchema');
const reviewController = require('../controller/review');

const router = express.Router();

router.post('/', authenticateUser, validate(reviewCreateSchema), reviewController.createReview);
router.get('/:type/:targetId', reviewController.getReviewsForTarget);

module.exports = router;
