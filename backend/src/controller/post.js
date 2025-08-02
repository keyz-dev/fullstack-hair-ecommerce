const Post = require('../models/post');
const User = require('../models/user');
const Category = require('../models/category');
const Service = require('../models/service');
const Product = require('../models/product');
const { uploadToCloudinary } = require('../utils/cloudinary');
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
        { content: { $regex: search, $options: 'i' } },
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
      .populate('comments.user', 'name avatar')
      .populate('comments.replies.user', 'name avatar')
      .populate('likes.user', 'name avatar');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Increment view count
    post.views += 1;
    await post.save();

    // Check if user has liked the post
    let userLiked = false;
    if (userId) {
      userLiked = post.likes.some(like => like.user._id.toString() === userId);
    }

    res.json({
      post,
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
      content,
      excerpt,
      type,
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
      socialShare
    } = req.body;

    const postData = {
      title,
      content,
      excerpt,
      author: req.user._id,
      type: type || 'post',
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
      socialShare
    };

    // Handle image uploads
    if (req.files && req.files.images) {
      const imageFiles = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      const uploadedImages = [];

      for (let i = 0; i < imageFiles.length; i++) {
        const result = await uploadToCloudinary(imageFiles[i], 'posts');
        uploadedImages.push({
          url: result.secure_url,
          alt: req.body.imageAlts?.[i] || '',
          caption: req.body.imageCaptions?.[i] || '',
          order: i
        });
      }

      postData.images = uploadedImages;
    }

    // Handle video uploads
    if (req.files && req.files.videos) {
      const videoFiles = Array.isArray(req.files.videos) ? req.files.videos : [req.files.videos];
      const uploadedVideos = [];

      for (let i = 0; i < videoFiles.length; i++) {
        const result = await uploadToCloudinary(videoFiles[i], 'posts/videos', { resource_type: 'video' });
        uploadedVideos.push({
          url: result.secure_url,
          thumbnail: result.thumbnail_url,
          duration: result.duration,
          caption: req.body.videoCaptions?.[i] || ''
        });
      }

      postData.videos = uploadedVideos;
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

    // Handle image uploads
    if (req.files && req.files.images) {
      const imageFiles = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      const uploadedImages = [];

      for (let i = 0; i < imageFiles.length; i++) {
        const result = await uploadToCloudinary(imageFiles[i], 'posts');
        uploadedImages.push({
          url: result.secure_url,
          alt: req.body.imageAlts?.[i] || '',
          caption: req.body.imageCaptions?.[i] || '',
          order: i
        });
      }

      updateData.images = uploadedImages;
    }

    // Handle video uploads
    if (req.files && req.files.videos) {
      const videoFiles = Array.isArray(req.files.videos) ? req.files.videos : [req.files.videos];
      const uploadedVideos = [];

      for (let i = 0; i < videoFiles.length; i++) {
        const result = await uploadToCloudinary(videoFiles[i], 'posts/videos', { resource_type: 'video' });
        uploadedVideos.push({
          url: result.secure_url,
          thumbnail: result.thumbnail_url,
          duration: result.duration,
          caption: req.body.videoCaptions?.[i] || ''
        });
      }

      updateData.videos = uploadedVideos;
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

// Add comment
const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, parentCommentId } = req.body;
    const userId = req.user._id;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (parentCommentId) {
      // Add reply to existing comment
      const parentComment = post.comments.id(parentCommentId);
      if (!parentComment) {
        return res.status(404).json({ message: 'Parent comment not found' });
      }

      parentComment.replies.push({
        user: userId,
        content
      });
    } else {
      // Add new comment
      post.comments.push({
        user: userId,
        content
      });
    }

    await post.save();

    // Populate user info for the new comment/reply
    await post.populate('comments.user', 'name avatar');
    await post.populate('comments.replies.user', 'name avatar');

    res.json({
      message: 'Comment added successfully',
      post
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Error adding comment', error: error.message });
  }
};

// Get post analytics
const getPostAnalytics = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const analytics = {
      views: post.views,
      likes: post.likes.length,
      comments: post.comments.length,
      shares: post.shares,
      engagementRate: post.engagementRate,
      totalReplies: post.comments.reduce((total, comment) => total + comment.replies.length, 0)
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