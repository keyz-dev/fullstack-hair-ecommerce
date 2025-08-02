const Joi = require('joi');

// Create comment schema
const createCommentSchema = Joi.object({
  postId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid post ID format',
      'any.required': 'Post ID is required'
    }),
  content: Joi.string()
    .required()
    .min(1)
    .max(500)
    .trim()
    .messages({
      'string.empty': 'Comment content is required',
      'string.min': 'Comment must be at least 1 character long',
      'string.max': 'Comment cannot exceed 500 characters',
      'any.required': 'Comment content is required'
    }),
  
  parentCommentId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Invalid parent comment ID format'
    })
});

// Update comment schema
const updateCommentSchema = Joi.object({
  content: Joi.string()
    .required()
    .min(1)
    .max(500)
    .trim()
    .messages({
      'string.empty': 'Comment content is required',
      'string.min': 'Comment must be at least 1 character long',
      'string.max': 'Comment cannot exceed 500 characters',
      'any.required': 'Comment content is required'
    })
});

// Moderate comment schema
const moderateCommentSchema = Joi.object({
  status: Joi.string()
    .valid('active', 'flagged', 'hidden', 'deleted')
    .required()
    .messages({
      'any.only': 'Status must be one of: active, flagged, hidden, deleted',
      'any.required': 'Status is required'
    })
});

// Query parameters schema for getting comments
const getCommentsQuerySchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      'number.base': 'Page must be a number',
      'number.integer': 'Page must be an integer',
      'number.min': 'Page must be at least 1'
    }),
    
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(20)
    .messages({
      'number.base': 'Limit must be a number',
      'number.integer': 'Limit must be an integer',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit cannot exceed 100'
    }),
    
  sortBy: Joi.string()
    .valid('createdAt', 'updatedAt', 'likeCount')
    .default('createdAt')
    .messages({
      'any.only': 'Sort by must be one of: createdAt, updatedAt, likeCount'
    }),
    
  sortOrder: Joi.string()
    .valid('asc', 'desc')
    .default('desc')
    .messages({
      'any.only': 'Sort order must be either asc or desc'
    })
});

module.exports = {
  createCommentSchema,
  updateCommentSchema,
  moderateCommentSchema,
  getCommentsQuerySchema
};
