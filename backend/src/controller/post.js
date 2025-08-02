const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');
const Category = require('../models/category');
const Service = require('../models/service');
const Product = require('../models/product');
const { createAdminLog } = require('../utils/adminLog');

// Get all posts with filtering and pagination
const getAllPosts = async (req, res) => {
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
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
  }
};

// Get single post by slug
const getPostBySlug = async (req, res) => {
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
    res.status(500).json({ message: 'Error fetching post', error: error.message });
  }
};

// Create new post
const createPost = async (req, res) => {
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

    const postData = {
      title,
      description,
      author: req.user._id,
      postType: postType || 'work-showcase',
      mediaType: mediaType || 'images',
      status: status || 'draft',
      featured: featured || false,
      tags: tags || [],
      categories: categories || [],
      services: services || [],
      products: products || [],
      callToAction,
      metaTitle,
      metaDescription,
      scheduledFor,
      socialShare,
      postMetadata: postMetadata || {}
    };

    // Handle file uploads based on mediaType (files are processed by multer middleware)
    if (req.files) {
      if (mediaType === 'images' && req.files.postImages) {
        const imageFiles = Array.isArray(req.files.postImages) ? req.files.postImages : [req.files.postImages];
        
        postData.images = imageFiles.map((file, index) => ({
          url: file.path,
          caption: req.body.imageCaptions?.[index] || '',
          order: index + 1
        }));
      }
      
      if (mediaType === 'video') {
        // For video posts, we need both video file and thumbnail
        if (!req.files.postVideo || !req.files.postVideo[0]) {
          return res.status(400).json({ message: 'Video file is required for video posts' });
        }

        // Use video file path from multer
        const videoFile = req.files.postVideo[0];
        let thumbnailPath = videoFile.path; // Default to video path if no separate thumbnail
        
        // Check if separate thumbnail is provided
        if (req.files.thumbnail && req.files.thumbnail[0]) {
          thumbnailPath = req.files.thumbnail[0].path;
        }

        postData.video = {
          url: videoFile.path,
          thumbnail: thumbnailPath,
          caption: req.body.videoCaption || ''
        };
      }
    }

    // Validate media requirements
    if (mediaType === 'images' && (!postData.images || postData.images.length === 0)) {
      return res.status(400).json({ message: 'At least one image is required for image posts' });
    }
    
    if (mediaType === 'video' && !postData.video) {
      return res.status(400).json({ message: 'Video file is required for video posts' });
    }

    const post = new Post(postData);
    await post.save();

    // Create admin log
    await createAdminLog({
      user: req.user._id,
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
    res.status(500).json({ message: 'Error creating post', error: error.message });
  }
};

// Update post
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
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
      user: req.user._id,
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
    res.status(500).json({ message: 'Error updating post', error: error.message });
  }
};

// Delete post
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    await Post.findByIdAndDelete(id);

    // Create admin log
    await createAdminLog({
      user: req.user._id,
      action: 'DELETE_POST',
      details: `Deleted post: ${post.title}`,
      resourceId: post._id,
      resourceType: 'Post'
    });

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Error deleting post', error: error.message });
  }
};

// Like/Unlike post
const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
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
    res.status(500).json({ message: 'Error toggling like', error: error.message });
  }
};

// Add comment (deprecated - use comment routes instead)
const addComment = async (req, res) => {
  res.status(410).json({
    message: 'This endpoint is deprecated. Please use POST /api/comments/post/:postId instead',
    newEndpoint: '/api/comments/post/' + req.params.id
  });
};

// Get post analytics
const getPostAnalytics = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
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
    res.status(500).json({ message: 'Error fetching analytics', error: error.message });
  }
};

// Get featured posts
const getFeaturedPosts = async (req, res) => {
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
    res.status(500).json({ message: 'Error fetching featured posts', error: error.message });
  }
};

// Get posts by category
const getPostsByCategory = async (req, res) => {
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
    res.status(500).json({ message: 'Error fetching posts by category', error: error.message });
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