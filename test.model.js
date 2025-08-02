const mongoose = require('mongoose');

// User Model - Simple with vendor focus
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  
  // Basic profile
  profile: {
    displayName: { type: String, required: true },
    avatar: { type: String }, // Profile image URL
    bio: { type: String, maxlength: 300 }
  },
  
  // Role system
  role: { 
    type: String, 
    enum: ['customer', 'admin', 'vendor'], 
    default: 'customer' 
  },
  
  // Vendor-specific info (only for vendors)
  vendorProfile: {
    businessName: { type: String },
    specialties: [{ type: String }], // e.g., ['natural hair', 'color', 'braids']
    location: { type: String },
    isVerified: { type: Boolean, default: false }
  },
  
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Post Model - Focused on hair industry essentials
const postSchema = new mongoose.Schema({
  // Who created it
  vendor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // Essential content
  title: { type: String, required: true, trim: true, maxlength: 150 },
  description: { type: String, maxlength: 1500 },
  
  // Post type - the key differentiator
  postType: { 
    type: String, 
    enum: [
      'work-showcase',     // Before/after client work
      'tutorial',          // Step-by-step how-to content
      'product-review',    // Reviewing/recommending products
      'styling-tip',       // Quick tips and advice
      'transformation',    // Dramatic hair changes
      'technique-demo'     // Showing specific techniques
    ], 
    required: true 
  },
  
  // Media type - either images or video
  mediaType: {
    type: String,
    enum: ['images', 'video'],
    required: true
  },
  
  // For image posts - multiple images in carousel
  images: [{
    url: { type: String, required: true },
    caption: { type: String, maxlength: 200, required: true },
    order: { type: Number, required: true }
  }],
  
  // For video posts - single video with thumbnail
  video: {
    url: { type: String },
    thumbnail: { type: String, required: true },
    caption: { type: String, maxlength: 200 }
  },
  
  // Hair-specific essentials (simple version)
  hairDetails: {
    hairType: { 
      type: String, 
      enum: ['straight', 'wavy', 'curly', 'coily', 'mixed'] 
    },
    serviceType: { 
      type: String, 
      enum: ['cut', 'color', 'styling', 'treatment', 'protective-style', 'chemical-service'] 
    },
    difficulty: { 
      type: String, 
      enum: ['beginner', 'intermediate', 'advanced', 'professional'] 
    },
    timeRequired: { type: String } // e.g., "2 hours", "30 minutes"
  },
  
  // Essential engagement
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  saves: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  views: { type: Number, default: 0 },
  
  // Simple tagging
  tags: [{ type: String, lowercase: true, trim: true }], // e.g., ['natural hair', 'twist out']
  
  // Post status
  status: { 
    type: String, 
    enum: ['draft', 'published', 'archived'], 
    default: 'published' 
  },
  
  // For admin featuring
  isFeatured: { type: Boolean, default: false }
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

// Validation middleware to enforce either/or media structure
postSchema.pre('save', function(next) {
  const post = this;
  
  if (post.mediaType === 'images') {
    // Must have images array with at least 1 image, no video
    if (!post.images || post.images.length === 0) {
      return next(new Error('Image posts must have at least one image'));
    }
    if (post.video && post.video.url) {
      return next(new Error('Image posts cannot have video content'));
    }
    // Sort images by order
    post.images = post.images.sort((a, b) => a.order - b.order);
  }
  
  if (post.mediaType === 'video') {
    // Must have video object, no images
    if (!post.video || !post.video.url) {
      return next(new Error('Video posts must have video content'));
    }
    if (post.images && post.images.length > 0) {
      return next(new Error('Video posts cannot have image content'));
    }
  }
  
  next();
});

// Virtual for like count
postSchema.virtual('likeCount').get(function() {
  return this.likes ? this.likes.length : 0;
});

// Virtual for save count  
postSchema.virtual('saveCount').get(function() {
  return this.saves ? this.saves.length : 0;
});

// Comment Model - Keep it simple
const commentSchema = new mongoose.Schema({
  post: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Post', 
    required: true 
  },
  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  content: { type: String, required: true, maxlength: 500 },
  
  // Simple reply system
  parentComment: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Comment',
    default: null 
  },
  
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  
  isDeleted: { type: Boolean, default: false }
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

commentSchema.virtual('likeCount').get(function() {
  return this.likes ? this.likes.length : 0;
});

// Indexes for performance
postSchema.index({ vendor: 1, createdAt: -1 });
postSchema.index({ postType: 1, status: 1 });
postSchema.index({ tags: 1 });
postSchema.index({ status: 1, isFeatured: -1, createdAt: -1 });

commentSchema.index({ post: 1, createdAt: -1 });
userSchema.index({ role: 1 });

const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);
const Comment = mongoose.model('Comment', commentSchema);

module.exports = { User, Post, Comment };