const Review = require('../models/review');
const Product = require('../models/product');
const { NotFoundError, BadRequestError, UnauthorizedError } = require('../utils/errors');

// 1. Create Review
exports.createReview = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { rating, title, comment } = req.body;
    const userId = req.authUser._id;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) return next(new NotFoundError('Product not found'));

    // Only one review per user per product
    const existing = await Review.findOne({ product: productId, user: userId });
    if (existing) return next(new BadRequestError('You have already reviewed this product'));

    const review = new Review({
      product: productId,
      user: userId,
      rating,
      title,
      comment,
      images: req.files ? req.files.map(f => f.path) : [],
    });
    await review.save();

    // Update product rating/count
    const reviews = await Review.find({ product: productId, isActive: true });
    const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
    product.rating = Math.round(avg * 10) / 10;
    product.reviewCount = reviews.length;
    product.reviews.push(review._id);
    await product.save();

    await review.populate('user', 'name avatar');
    res.status(201).json({ success: true, review });
  } catch (err) { next(err); }
};

// 2. Get Reviews for a Product
exports.getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const product = await Product.findById(productId);
    if (!product) return next(new NotFoundError('Product not found'));

    const reviews = await Review.find({ product: productId, isActive: true })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    const total = await Review.countDocuments({ product: productId, isActive: true });

    res.status(200).json({
      success: true,
      data: {
        reviews,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (err) { next(err); }
};

// 3. Update Review
exports.updateReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { rating, title, comment } = req.body;
    const userId = req.authUser._id;

    const review = await Review.findById(reviewId);
    if (!review) return next(new NotFoundError('Review not found'));
    if (review.user.toString() !== userId.toString()) {
      return next(new UnauthorizedError('You can only update your own reviews'));
    }

    review.rating = rating;
    review.title = title;
    review.comment = comment;
    if (req.files && req.files.length > 0) {
      review.images = req.files.map(f => f.path);
    }
    await review.save();

    // Update product rating/count
    const product = await Product.findById(review.product);
    const reviews = await Review.find({ product: review.product, isActive: true });
    const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
    product.rating = Math.round(avg * 10) / 10;
    product.reviewCount = reviews.length;
    await product.save();

    await review.populate('user', 'name avatar');
    res.status(200).json({ success: true, review });
  } catch (err) { next(err); }
};

// 4. Delete Review
exports.deleteReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const userId = req.authUser._id;

    const review = await Review.findById(reviewId);
    if (!review) return next(new NotFoundError('Review not found'));
    if (review.user.toString() !== userId.toString() && req.authUser.role !== 'admin') {
      return next(new UnauthorizedError('You can only delete your own reviews'));
    }

    const productId = review.product;
    await review.deleteOne();

    // Update product rating/count
    const product = await Product.findById(productId);
    const reviews = await Review.find({ product: productId, isActive: true });
    product.rating = reviews.length
      ? Math.round(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length * 10) / 10
      : 0;
    product.reviewCount = reviews.length;
    product.reviews = product.reviews.filter(id => id.toString() !== reviewId);
    await product.save();

    res.status(200).json({ success: true, message: 'Review deleted successfully' });
  } catch (err) { next(err); }
};

// 5. Mark Review as Helpful
exports.markReviewHelpful = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { helpful } = req.body;
    const userId = req.authUser._id;

    const review = await Review.findById(reviewId);
    if (!review) return next(new NotFoundError('Review not found'));

    const existing = review.helpful.find(h => h.user.toString() === userId.toString());
    if (existing) {
      existing.helpful = helpful;
    } else {
      review.helpful.push({ user: userId, helpful });
    }
    await review.save();

    res.status(200).json({
      success: true,
      helpfulCount: review.helpfulCount,
      notHelpfulCount: review.notHelpfulCount,
    });
  } catch (err) { next(err); }
};

// 6. Admin: Verify Review
exports.verifyReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { isVerified } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) return next(new NotFoundError('Review not found'));

    review.isVerified = isVerified;
    await review.save();

    res.status(200).json({
      success: true,
      message: `Review ${isVerified ? 'verified' : 'unverified'} successfully`,
      review,
    });
  } catch (err) { next(err); }
};
