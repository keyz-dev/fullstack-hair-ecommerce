const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');
const Category = require('../models/category');
const Service = require('../models/service');
const Product = require('../models/product');
const { createAdminLog } = require('../utils/adminLog');
const { validate } = require('../middleware/validate');
const { createPostSchema } = require('../schema/postSchema');
const { BadRequestError, NotFoundError, InternalServerError } = require('../utils/errors');

// Get all posts with filtering and pagination
const getAllPosts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status = 'published',
      type,
      category,
      tag,
      search,
      featured,
      author,
      sortBy = 'publishedAt',
      sortOrder = 'desc'
    } = req.query;

    const query = {};

    // Status filter
    if (status) {
      query.status = status;
    }

    // Type filter
    if (type) {
      query.type = type;
    }

    // Category filter
    if (category) {
      query.categories = category;
    }

    // Tag filter
    if (tag) {
      query.tags = { $in: [tag] };
    }

    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Featured filter
    if (featured !== undefined) {
      query.featured = featured === 'true';
    }

    // Author filter
    if (author) {
      query.author = author;
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const posts = await Post.find(query)
      .populate('author', 'name avatar')
      .populate('categories', 'name')
      .populate('services', 'name price')
      .populate('products', 'name price images')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Post.countDocuments(query);

    res.json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
      hasNext: page * limit < total,
      hasPrev: page > 1
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return next(new InternalServerError('Error fetching posts'));
  }
};

// Get single post by slug
const getPostBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { userId } = req.query;

    const post = await Post.findOne({ slug, status: 'published' })
      .populate('author', 'name avatar bio')
      .populate('categories', 'name')
      .populate('services', 'name price description')
      .populate('products', 'name price images description')
      .populate('likes.user', 'name avatar');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Get comment count separately
    const commentCount = await Comment.countDocuments({
      post: post._id,
      isDeleted: false,
      status: 'active'
    });

    // Increment view count
    post.views += 1;
    await post.save();

    // Check if user has liked the post
    let userLiked = false;
    if (userId) {
      userLiked = post.likes.some(like => like.user._id.toString() === userId);
    }

    res.json({
      post: {
        ...post.toObject(),
        commentCount
      },
      userLiked
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    return next(new InternalServerError('Error fetching post'));
  }
};

// Create new post
const createPost = async (req, res, next) => {
  try {
    const {
      title,
      description,
      postType,
      mediaType,
      status,
      featured,
      tags,
      categories,
      services,
      products,
      callToAction,
      metaTitle,
      metaDescription,
      scheduledFor,
      socialShare,
      postMetadata
    } = req.body;

    // Helper function to parse JSON strings to objects
    const parseJsonField = (field) => {
      if (typeof field === 'string') {
        try {
          return JSON.parse(field);
        } catch (error) {
          console.error('Error parsing JSON field:', error);
          return field;
        }
      }
      return field;
    };

    // Parse all object fields
    const parsedData = {
      callToAction: parseJsonField(callToAction),
      socialShare: parseJsonField(socialShare),
      postMetadata: parseJsonField(postMetadata),
      tags: parseJsonField(tags),
      categories: parseJsonField(categories),
      services: parseJsonField(services),
      products: parseJsonField(products)
    };

    const postData = {
      title,
      description,
      author: req.authUser?._id,
      postType: postType || 'work-showcase',
      mediaType: mediaType || 'images',
      status: status || 'draft',
      featured: featured || false,
      metaTitle,
      metaDescription,
      scheduledFor,
      ...parsedData
    };

    console.log('Parsed postData:', postData);

    // Validate the parsed data using the schema
    const { error } = createPostSchema.validate(postData);
    if (error) {
      return next(new BadRequestError(error.details[0].message));
    }

    // Handle file uploads based on mediaType (files are processed by multer middleware)
    if (req.files) {
      if (mediaType === 'images' && req.files.postImages) {
        const imageFiles = Array.isArray(req.files.postImages) ? req.files.postImages : [req.files.postImages];
        
        // Validate that images were actually uploaded
        if (imageFiles.length === 0) {
          return next(new BadRequestError('At least one image is required for image posts'));
        }
        
        // Validate file paths exist
        const validImages = imageFiles.filter(file => file && file.path);
        if (validImages.length === 0) {
          return next(new BadRequestError('No valid images were uploaded'));
        }
        
        // Parse imageOrder and imageCaptions arrays properly
        let imageOrderArray = req.body.imageOrder;
        let imageCaptionsArray = req.body.imageCaptions;
        
        if (typeof imageOrderArray === 'string') {
          try {
            imageOrderArray = JSON.parse(imageOrderArray);
          } catch (error) {
            console.error('Error parsing imageOrder:', error);
            imageOrderArray = [];
          }
        }
        
        if (typeof imageCaptionsArray === 'string') {
          try {
            imageCaptionsArray = JSON.parse(imageCaptionsArray);
          } catch (error) {
            console.error('Error parsing imageCaptions:', error);
            imageCaptionsArray = [];
          }
        }
        
        postData.images = validImages.map((file, index) => ({
          url: file.path,
          caption: imageCaptionsArray?.[index] || '',
          order: parseInt(imageOrderArray?.[index]) || index + 1
        }));
      }
      
      if (mediaType === 'video') {
        // For video posts, we need both video file and thumbnail
        if (!req.files.postVideo || !req.files.postVideo[0]) {
          return next(new BadRequestError('Video file is required for video posts'));
        }

        // Validate video file was actually uploaded
        const videoFile = req.files.postVideo[0];
        if (!videoFile || !videoFile.path) {
          return next(new BadRequestError('Invalid video file uploaded'));
        }

        // Use video file path from multer
        let thumbnailPath = videoFile.path; // Default to video path if no separate thumbnail
        
        // Check if separate thumbnail is provided
        if (req.files.thumbnail && req.files.thumbnail[0] && req.files.thumbnail[0].path) {
          thumbnailPath = req.files.thumbnail[0].path;
        }

        postData.video = {
          url: videoFile.path,
          thumbnail: thumbnailPath,
          caption: req.body.videoCaption || ''
        };
      }
    }

    // Validate media requirements after file processing
    if (mediaType === 'images' && (!postData.images || postData.images.length === 0)) {
      return next(new BadRequestError('At least one image is required for image posts'));
    }
    
    if (mediaType === 'video' && !postData.video) {
      return next(new BadRequestError('Video file is required for video posts'));
    }

    console.log(req.files)
    console.log(postData)

    const post = new Post(postData);
    await post.save();

    // Create admin log
    await createAdminLog({
      user: req.authUser._id,
      action: 'CREATE_POST',
      details: `Created post: ${title}`,
      resourceId: post._id,
      resourceType: 'Post'
    });

    res.status(201).json({
      message: 'Post created successfully',
      post
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return next(new InternalServerError('Error creating post'));
  }
};

// Update post
const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    let updateData = req.body;

    const post = await Post.findById(id);
    if (!post) {
      return next(new NotFoundError('Post not found'));
    }

    // Helper function to parse JSON strings to objects
    const parseJsonField = (field) => {
      if (typeof field === 'string') {
        try {
          return JSON.parse(field);
        } catch (error) {
          console.error('Error parsing JSON field:', error);
          return field;
        }
      }
      return field;
    };

    // Parse all object fields
    const fieldsToParse = ['callToAction', 'socialShare', 'postMetadata', 'tags', 'categories', 'services', 'products'];
    fieldsToParse.forEach(field => {
      if (updateData[field]) {
        updateData[field] = parseJsonField(updateData[field]);
      }
    });

    // Handle file uploads based on mediaType (files are processed by multer middleware)
    if (req.files) {
      if (req.body.mediaType === 'images' && req.files.postImages) {
        const imageFiles = Array.isArray(req.files.postImages) ? req.files.postImages : [req.files.postImages];
        
        updateData.images = imageFiles.map((file, index) => ({
          url: file.path,
          caption: req.body.imageCaptions?.[index] || '',
          order: index + 1
        }));
        updateData.video = undefined; // Clear video if switching to images
      }
      
      if (req.body.mediaType === 'video' && req.files.postVideo && req.files.postVideo[0]) {
        // Use video file path from multer
        const videoFile = req.files.postVideo[0];
        let thumbnailPath = videoFile.path; // Default to video path if no separate thumbnail
        
        // Check if separate thumbnail is provided
        if (req.files.thumbnail && req.files.thumbnail[0]) {
          thumbnailPath = req.files.thumbnail[0].path;
        }

        updateData.video = {
          url: videoFile.path,
          thumbnail: thumbnailPath,
          caption: req.body.videoCaption || ''
        };
        updateData.images = []; // Clear images if switching to video
      }
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('author', 'name avatar');

    // Create admin log
    await createAdminLog({
      user: req.authUser._id,
      action: 'UPDATE_POST',
      details: `Updated post: ${updatedPost.title}`,
      resourceId: updatedPost._id,
      resourceType: 'Post'
    });

    res.json({
      message: 'Post updated successfully',
      post: updatedPost
    });
  } catch (error) {
    console.error('Error updating post:', error);
    return next(new InternalServerError('Error updating post'));
  }
};

// Delete post
const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return next(new NotFoundError('Post not found'));
    }

    await Post.findByIdAndDelete(id);

    // Create admin log
    await createAdminLog({
      user: req.authUser._id,
      action: 'DELETE_POST',
      details: `Deleted post: ${post.title}`,
      resourceId: post._id,
      resourceType: 'Post'
    });

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return next(new InternalServerError('Error deleting post'));
  }
};

// Like/Unlike post
const toggleLike = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.authUser._id;

    const post = await Post.findById(id);
    if (!post) {
      return next(new NotFoundError('Post not found'));
    }

    const existingLike = post.likes.find(like => like.user.toString() === userId.toString());

    if (existingLike) {
      // Unlike
      post.likes = post.likes.filter(like => like.user.toString() !== userId.toString());
    } else {
      // Like
      post.likes.push({ user: userId });
    }

    await post.save();

    res.json({
      message: existingLike ? 'Post unliked' : 'Post liked',
      likeCount: post.likes.length,
      userLiked: !existingLike
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    return next(new InternalServerError('Error toggling like'));
  }
};

// Add comment (deprecated - use comment routes instead)
const addComment = async (req, res, next) => {
  return next(new BadRequestError('This endpoint is deprecated. Please use POST /api/comments/post/:postId instead'));
};

// Get post analytics
const getPostAnalytics = async (req, res, next) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return next(new NotFoundError('Post not found'));
    }

    // Get comment count from separate collection
    const commentCount = await Comment.countDocuments({
      post: id,
      isDeleted: false,
      status: 'active'
    });

    const analytics = {
      views: post.views,
      likes: post.likes.length,
      saves: post.saves.length,
      comments: commentCount,
      shares: post.shares,
      engagementRate: post.engagementRate
    };

    res.json(analytics);
  } catch (error) {
    console.error('Error fetching post analytics:', error);
    return next(new InternalServerError('Error fetching analytics'));
  }
};

// Get featured posts
const getFeaturedPosts = async (req, res, next) => {
  try {
    const { limit = 6 } = req.query;

    const posts = await Post.find({
      status: 'published',
      featured: true
    })
      .populate('author', 'name avatar')
      .populate('categories', 'name')
      .sort({ publishedAt: -1 })
      .limit(parseInt(limit));

    res.json(posts);
  } catch (error) {
    console.error('Error fetching featured posts:', error);
    return next(new InternalServerError('Error fetching featured posts'));
  }
};

// Get posts by category
const getPostsByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const posts = await Post.find({
      status: 'published',
      categories: categoryId
    })
      .populate('author', 'name avatar')
      .populate('categories', 'name')
      .sort({ publishedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Post.countDocuments({
      status: 'published',
      categories: categoryId
    });

    res.json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching posts by category:', error);
    return next(new InternalServerError('Error fetching posts by category'));
  }
};

module.exports = {
  getAllPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  addComment,
  getPostAnalytics,
  getFeaturedPosts,
  getPostsByCategory
}; 