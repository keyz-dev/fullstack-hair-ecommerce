const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    maxlength: 10000
  },
  excerpt: {
    type: String,
    maxlength: 300,
    trim: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['post', 'story', 'reel', 'transformation', 'tutorial', 'promotion'],
    default: 'post'
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  },
  images: [{
    url: String,
    alt: String,
    caption: String,
    order: Number
  }],
  videos: [{
    url: String,
    thumbnail: String,
    duration: Number,
    caption: String
  }],
  tags: [{
    type: String,
    trim: true
  }],
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  // Business-specific fields
  services: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  }],
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  callToAction: {
    text: String,
    link: String,
    type: {
      type: String,
      enum: ['booking', 'product', 'contact', 'whatsapp', 'custom']
    }
  },
  // Engagement metrics
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
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    content: {
      type: String,
      required: true,
      maxlength: 1000
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    replies: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      content: {
        type: String,
        required: true,
        maxlength: 1000
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }]
  }],
  views: {
    type: Number,
    default: 0
  },
  shares: {
    type: Number,
    default: 0
  },
  // SEO fields
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
  // Social media integration
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

// Virtual for comment count
postSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// Virtual for engagement rate
postSchema.virtual('engagementRate').get(function() {
  if (this.views === 0) return 0;
  return ((this.likes.length + this.comments.length) / this.views * 100).toFixed(2);
});

// Indexes for better performance
postSchema.index({ status: 1, publishedAt: -1 });
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ tags: 1 });
postSchema.index({ categories: 1 });
postSchema.index({ slug: 1 });
postSchema.index({ featured: 1, publishedAt: -1 });

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