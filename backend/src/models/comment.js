const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  // Reference to the post this comment belongs to
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  
  // Who made the comment
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Comment content
  content: {
    type: String,
    required: true,
    maxlength: 500,
    trim: true
  },
  
  // Simple reply system (optional - can reference parent comment)
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  
  // Comment engagement
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
  
  // Comment status for moderation
  status: {
    type: String,
    enum: ['active', 'flagged', 'hidden', 'deleted'],
    default: 'active'
  },
  
  // Soft delete
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

// Virtual for like count
commentSchema.virtual('likeCount').get(function() {
  return this.likes ? this.likes.length : 0;
});

// Virtual to check if it's a reply
commentSchema.virtual('isReply').get(function() {
  return this.parentComment !== null;
});

// Indexes for performance
commentSchema.index({ post: 1, createdAt: -1 }); // Get comments for a post
commentSchema.index({ author: 1, createdAt: -1 }); // Get user's comments
commentSchema.index({ parentComment: 1 }); // Get replies to a comment
commentSchema.index({ status: 1, isDeleted: 1 }); // Moderation queries

// Pre-save middleware for validation
commentSchema.pre('save', function(next) {
  // Ensure content is not empty after trimming
  if (!this.content || this.content.trim().length === 0) {
    return next(new Error('Comment content cannot be empty'));
  }
  next();
});

module.exports = mongoose.model('Comment', commentSchema);
