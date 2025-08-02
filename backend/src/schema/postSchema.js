const Joi = require('joi');

// Create post schema
const createPostSchema = Joi.object({
  title: Joi.string()
    .required()
    .min(1)
    .max(150)
    .trim()
    .messages({
      'string.empty': 'Title is required',
      'string.min': 'Title must be at least 1 character long',
      'string.max': 'Title cannot exceed 150 characters',
      'any.required': 'Title is required'
    }),

  description: Joi.string()
    .max(1500)
    .trim()
    .allow('')
    .messages({
      'string.max': 'Description cannot exceed 1500 characters'
    }),

  postType: Joi.string()
    .valid('work-showcase', 'tutorial', 'product-review', 'styling-tip', 'transformation', 'technique-demo', 'promotion')
    .default('work-showcase')
    .messages({
      'any.only': 'Post type must be one of: work-showcase, tutorial, product-review, styling-tip, transformation, technique-demo, promotion'
    }),

  mediaType: Joi.string()
    .valid('images', 'video')
    .required()
    .messages({
      'any.only': 'Media type must be either images or video',
      'any.required': 'Media type is required'
    }),

  status: Joi.string()
    .valid('draft', 'published', 'archived')
    .default('draft')
    .messages({
      'any.only': 'Status must be one of: draft, published, archived'
    }),

  featured: Joi.boolean()
    .default(false),

  tags: Joi.array()
    .items(Joi.string().trim().lowercase())
    .default([])
    .messages({
      'array.base': 'Tags must be an array'
    })
    .optional(),

  categories: Joi.array()
    .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
    .optional()
    .default([])
    .messages({
      'array.base': 'Categories must be an array',
      'string.pattern.base': 'Invalid category ID format'
    }),

  services: Joi.array()
    .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
    .optional()
    .default([])
    .messages({
      'array.base': 'Services must be an array',
      'string.pattern.base': 'Invalid service ID format'
    }),

  products: Joi.array()
    .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
    .optional()
    .default([])
    .messages({
      'array.base': 'Products must be an array',
      'string.pattern.base': 'Invalid product ID format'
    }),

  callToAction: Joi.object({
    text: Joi.string().max(100),
    link: Joi.string().uri(),
    type: Joi.string().valid('booking', 'product', 'contact', 'whatsapp', 'custom')
  }).optional(),

  postMetadata: Joi.object({
    difficulty: Joi.string().valid('beginner', 'intermediate', 'advanced', 'professional'),
    timeRequired: Joi.string().max(50),
    clientConsent: Joi.boolean().default(false)
  }).optional().default({}),

  metaTitle: Joi.string().max(60).allow('').optional(),
  metaDescription: Joi.string().max(160).allow('').optional(),
  
  scheduledFor: Joi.date().iso().optional(),

  socialShare: Joi.object({
    facebook: Joi.boolean().default(false),
    instagram: Joi.boolean().default(false),
    whatsapp: Joi.boolean().default(false)
  }).optional().default({})
}).custom((value, helpers) => {
  // Custom validation to ensure media requirements are met
  const { mediaType } = value;
  
  if (mediaType === 'images') {
    // For image posts, we expect images to be uploaded via multer
    // This will be validated in the controller after file upload
    return value;
  }
  
  if (mediaType === 'video') {
    // For video posts, we expect video and optionally thumbnail to be uploaded via multer
    // This will be validated in the controller after file upload
    return value;
  }
  
  return value;
});

// Update post schema (similar to create but without required fields)
const updatePostSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .max(150)
    .trim()
    .messages({
      'string.empty': 'Title cannot be empty',
      'string.min': 'Title must be at least 1 character long',
      'string.max': 'Title cannot exceed 150 characters'
    }),

  description: Joi.string()
    .max(1500)
    .trim()
    .allow('')
    .messages({
      'string.max': 'Description cannot exceed 1500 characters'
    }),

  postType: Joi.string()
    .valid('work-showcase', 'tutorial', 'product-review', 'styling-tip', 'transformation', 'technique-demo', 'promotion')
    .messages({
      'any.only': 'Post type must be one of: work-showcase, tutorial, product-review, styling-tip, transformation, technique-demo, promotion'
    }),

  mediaType: Joi.string()
    .valid('images', 'video')
    .messages({
      'any.only': 'Media type must be either images or video'
    }),

  status: Joi.string()
    .valid('draft', 'published', 'archived')
    .messages({
      'any.only': 'Status must be one of: draft, published, archived'
    }),

  featured: Joi.boolean(),

  tags: Joi.array()
    .items(Joi.string().trim().lowercase())
    .messages({
      'array.base': 'Tags must be an array'
    }),

  categories: Joi.array()
    .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
    .messages({
      'array.base': 'Categories must be an array',
      'string.pattern.base': 'Invalid category ID format'
    }),

  services: Joi.array()
    .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
    .messages({
      'array.base': 'Services must be an array',
      'string.pattern.base': 'Invalid service ID format'
    }),

  products: Joi.array()
    .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
    .messages({
      'array.base': 'Products must be an array',
      'string.pattern.base': 'Invalid product ID format'
    }),

  callToAction: Joi.object({
    text: Joi.string().max(100),
    link: Joi.string().uri(),
    type: Joi.string().valid('booking', 'product', 'contact', 'whatsapp', 'custom')
  }).optional(),

  postMetadata: Joi.object({
    difficulty: Joi.string().valid('beginner', 'intermediate', 'advanced', 'professional'),
    timeRequired: Joi.string().max(50),
    clientConsent: Joi.boolean()
  }),

  metaTitle: Joi.string().max(60).allow(''),
  metaDescription: Joi.string().max(160).allow(''),
  
  scheduledFor: Joi.date().iso().optional(),

  socialShare: Joi.object({
    facebook: Joi.boolean(),
    instagram: Joi.boolean(),
    whatsapp: Joi.boolean()
  })
});

// Query parameters schema for getting posts
const getPostsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10),
  status: Joi.string().valid('draft', 'published', 'archived').default('published'),
  postType: Joi.string().valid('work-showcase', 'tutorial', 'product-review', 'styling-tip', 'transformation', 'technique-demo', 'promotion'),
  category: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
  tag: Joi.string(),
  search: Joi.string().max(100),
  featured: Joi.boolean(),
  author: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
  sortBy: Joi.string().valid('publishedAt', 'createdAt', 'updatedAt', 'views', 'likes').default('publishedAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc')
});

module.exports = {
  createPostSchema,
  updatePostSchema,
  getPostsQuerySchema
};
