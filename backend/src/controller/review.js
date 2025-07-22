const Review = require('../models/review');
const { BadRequestError, ConflictError } = require('../utils/errors');
const { reviewCreateSchema } = require('../schema/reviewSchema');

// Create a review
exports.createReview = async (req, res, next) => {
  const { error } = reviewCreateSchema.validate(req.body);
  if (error) return next(new BadRequestError(error.details[0].message));
  const { type, target, rating, comment } = req.body;
  const reviewer = req.rootUser._id;
  // Check if already reviewed
  const existingReview = await Review.findOne({ reviewer, type, target });
  if (existingReview) return next(new ConflictError('You have already reviewed this item'));
  const review = await Review.create({ reviewer, type, target, rating, comment });
  res.status(201).json({ success: true, review });
};

// Get reviews for a product or service
exports.getReviewsForTarget = async (req, res, next) => {
  const { type, targetId } = req.params;
  const reviews = await Review.find({ type, target: targetId }).populate('reviewer', 'name avatar').sort({ createdAt: -1 });
  const avgRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) : 0;
  res.json({ success: true, reviews, averageRating: avgRating.toFixed(1), totalReviews: reviews.length });
};
