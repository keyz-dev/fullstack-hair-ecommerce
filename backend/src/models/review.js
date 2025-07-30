
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  title: {
    type: String,
    required: true,
    maxLength: 100,
  },
  comment: {
    type: String,
    required: true,
    maxLength: 1000,
  },
  images: [String], // Optional review images
  isVerified: {
    type: Boolean,
    default: false, // Admin can verify reviews
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  helpful: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    helpful: { type: Boolean } // true for helpful, false for not helpful
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for helpful count
reviewSchema.virtual('helpfulCount').get(function() {
  return this.helpful.filter(h => h.helpful === true).length;
});

// Virtual for not helpful count
reviewSchema.virtual('notHelpfulCount').get(function() {
  return this.helpful.filter(h => h.helpful === false).length;
});

// Index for better performance
reviewSchema.index({ product: 1, createdAt: -1 });
reviewSchema.index({ user: 1, product: 1 }, { unique: true }); // One review per user per product
reviewSchema.index({ isActive: 1, isVerified: 1 });

module.exports = mongoose.model('Review', reviewSchema);
