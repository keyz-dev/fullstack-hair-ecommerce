const Post = require('../models/post');
const Comment = require('../models/comment');
const { createAdminLog } = require('../utils/adminLog');
const { validate } = require('../middleware/validate');
const { createPostSchema } = require('../schema/postSchema');
const { BadRequestError, NotFoundError, InternalServerError } = require('../utils/errors');
const { cleanUpFileImages } = require('../utils/imageCleanup');

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

    // Status filter - only apply if status is provided
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

    console.log("\n Fetched posts")
    console.log(posts)

    res.json({
      message: 'Posts fetched successfully',
      success: true,
      data: {
        posts,
        pagination: {
          totalPages: Math.ceil(total / limit),
          currentPage: page,
          total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
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

    const parseJsonField = (field) => {
      if (typeof field === 'string') {
        try {
          return JSON.parse(field);
        } catch (error) {
          console.error(`Error parsing field: ${field}`, error);
          return null;
        }
      }
      return field;
    };

    const postData = {
      title,
      description,
      postType,
      mediaType,
      status,
      featured,
      metaTitle,
      metaDescription,
      scheduledFor: scheduledFor ? new Date(scheduledFor) : undefined,
      callToAction: parseJsonField(callToAction),
      socialShare: parseJsonField(socialShare),
      postMetadata: parseJsonField(postMetadata),
      tags: parseJsonField(tags),
      categories: parseJsonField(categories),
      services: parseJsonField(services),
      products: parseJsonField(products),
    };

    const { error } = createPostSchema.validate(postData);

    // Generate slug from title
    if (postData.title) {
      postData.slug = postData.title
        .toLowerCase()
        .trim()
        .replace(/&/g, '-and-')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
    }

    // set the author
    postData.author = req.authUser?._id;

    if (error) {
      return next(new BadRequestError(error.details[0].message));
    }

    if (req.files) {
      if (mediaType === 'images' && req.files.postImages) {
        const imageFiles = Array.isArray(req.files.postImages) ? req.files.postImages : [req.files.postImages];
        const validImages = imageFiles.filter(file => file && file.path);
        if (validImages.length === 0) {
          return next(new BadRequestError('No valid images were uploaded'));
        }

        let imageOrderArray = parseJsonField(req.body.imageOrder) || [];
        let imageCaptionsArray = parseJsonField(req.body.imageCaptions) || [];

        postData.images = validImages.map((file, index) => ({
          url: file.path,
          caption: imageCaptionsArray?.[index] || '',
          order: parseInt(imageOrderArray?.[index]) || index + 1
        }));
      } else if (mediaType === 'video') {
        const videoFile = req.files.postVideo?.[0];
        const thumbnailFile = req.files.thumbnail?.[0];

        if (!videoFile) {
          return next(new BadRequestError('Video file is required for video posts'));
        }
        if (!thumbnailFile) {
          return next(new BadRequestError('Thumbnail is required for video posts'));
        }

        postData.video = {
          url: videoFile.path,
          thumbnail: thumbnailFile.path,
          caption: req.body.videoCaption || ''
        };
      }
    }

    if (mediaType === 'images' && (!postData.images || postData.images.length === 0)) {
      return next(new BadRequestError('At least one image is required for image posts'));
    }
    if (mediaType === 'video' && (!postData.video || !postData.video.url)) {
      return next(new BadRequestError('Video file is required for video posts'));
    }

    console.log("\n=======About to the created ============")
    console.log("postData: ", postData)
    console.log("\n===================")

    const post = new Post(postData);
    await post.save();

    await createAdminLog({
      user: req.authUser._id,
      action: 'CREATE_POST',
      details: `Created new post: ${post.title}`,
      resourceId: post._id,
      resourceType: 'Post'
    });

    res.status(201).json({
      message: 'Post created successfully',
      success: true,
      post
    });
  } catch (error) {
    if (req.files || req.file) await cleanUpFileImages(req);
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

    // Handle scheduledFor date conversion
    if (updateData.scheduledFor !== undefined) {
      if (updateData.scheduledFor && updateData.scheduledFor !== '' && updateData.scheduledFor !== 'null') {
        try {
          // Convert to ISO format if it's not already
          const date = new Date(updateData.scheduledFor);
          if (!isNaN(date.getTime())) {
            updateData.scheduledFor = date.toISOString();
          } else {
            updateData.scheduledFor = null;
          }
        } catch (error) {
          console.error('Error parsing scheduledFor date:', error);
          updateData.scheduledFor = null;
        }
      } else {
        updateData.scheduledFor = null;
      }
    }

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

const getPostStats = async (req, res, next) => {
  try {
    const stats = await Post.aggregate([
      {
        $group: {
          _id: null,
          totalPosts: { $sum: 1 },
          totalViews: { $sum: '$views' },
          totalLikes: { $sum: '$likes' },
          totalComments: { $sum: '$comments' },
        }
      },
      {
        $addFields: {
          // This is a separate, potentially slower query. Consider if needed.
          featuredPosts: { $sum: 0 } // Placeholder, will be calculated below
        }
      }
    ]);

    const featuredPostsCount = await Post.countDocuments({ featured: true });

    if (stats.length > 0) {
      stats[0].featuredPosts = featuredPostsCount;
      res.json(stats[0]);
    } else {
      // If there are no posts, return zeroed stats
      res.json({
        totalPosts: 0,
        totalViews: 0,
        totalLikes: 0,
        totalComments: 0,
        featuredPosts: 0
      });
    }
  } catch (error) {
    console.error('Error fetching post stats:', error);
    return next(new InternalServerError('Error fetching post stats'));
  }
};

module.exports = {
  getAllPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
  getPostStats,
  toggleLike,
  addComment,
  getPostAnalytics,
  getFeaturedPosts,
  getPostsByCategory
};