const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  // Essential content - simplified from content/excerpt to just description
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 150
  },
  description: {
    type: String,
    maxlength: 1500,
    trim: true
  },
  
  // Who created it (vendor)
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Hair industry specific post types
  postType: {
    type: String,
    enum: [
      'work-showcase',     // Before/after client work
      'tutorial',          // Step-by-step how-to content
      'product-review',    // Reviewing/recommending products
      'styling-tip',       // Quick tips and advice
      'transformation',    // Dramatic hair changes
      'technique-demo',    // Showing specific techniques
      'promotion'          // Business promotions
    ],
    required: true
  },
  
  // Clear media type - either images or video, never both
  mediaType: {
    type: String,
    enum: ['images', 'video'],
    required: true
  },
  
  // For image posts - carousel of images
  images: [{
    url: { type: String, required: true },
    caption: { type: String, maxlength: 200 },
    order: { type: Number, required: true }
  }],
  
  // For video posts - single video
  video: {
    url: { type: String },
    thumbnail: { type: String, required: true },
    caption: { type: String, maxlength: 200 }
  },
  
  // References to existing models (no duplication)
  services: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  }],
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  
  // Post-specific metadata (non-duplicated fields)
  postMetadata: {
    difficulty: { 
      type: String, 
      enum: ['beginner', 'intermediate', 'advanced', 'professional'] 
    },
    timeRequired: { type: String }, // e.g., "2 hours"
    clientConsent: { type: Boolean, default: false } // For showcasing client work
  },
  
  // Business conversion
  callToAction: {
    text: String,
    link: String,
    type: {
      type: String,
      enum: ['booking', 'product', 'contact', 'whatsapp', 'custom']
    }
  },
  
  // Simple engagement - no nested comments
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  saves: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  views: {
    type: Number,
    default: 0
  },
  shares: {
    type: Number,
    default: 0
  },
  
  // Discoverability
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  
  // Post management
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  },
  featured: {
    type: Boolean,
    default: false
  },
  
  // SEO & Marketing
  slug: {
    type: String,
    unique: true,
    required: true
  },
  metaTitle: String,
  metaDescription: String,
  
  // Scheduling
  publishedAt: {
    type: Date,
    default: Date.now
  },
  scheduledFor: Date,
  
  // Social sharing
  socialShare: {
    facebook: { type: Boolean, default: false },
    instagram: { type: Boolean, default: false },
    whatsapp: { type: Boolean, default: false }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for like count
postSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for save count
postSchema.virtual('saveCount').get(function() {
  return this.saves.length;
});

// Note: commentCount will be populated via aggregation or separate query
// since comments are now in a separate collection

// Virtual for engagement rate (without comments for now)
postSchema.virtual('engagementRate').get(function() {
  if (this.views === 0) return 0;
  return ((this.likes.length + this.saves.length) / this.views * 100).toFixed(2);
});

// Indexes for better performance
postSchema.index({ status: 1, publishedAt: -1 });
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ tags: 1 });
postSchema.index({ categories: 1 });
postSchema.index({ featured: 1, publishedAt: -1 });

// Media validation middleware - enforce either images OR video
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

// Pre-save middleware to generate slug
postSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('Post', postSchema); 