const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');
const { createAdminLog } = require('../utils/adminLog');

// Get all comments for a specific post
const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    // Verify post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const query = { 
      post: postId, 
      isDeleted: false,
      status: 'active',
      parentComment: null // Only get top-level comments
    };

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const comments = await Comment.find(query)
      .populate('author', 'name avatar')
      .populate('likes.user', 'name avatar')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // Get replies for each comment
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment.find({
          parentComment: comment._id,
          isDeleted: false,
          status: 'active'
        })
          .populate('author', 'name avatar')
          .populate('likes.user', 'name avatar')
          .sort({ createdAt: 1 });

        return {
          ...comment.toObject(),
          replies
        };
      })
    );

    const total = await Comment.countDocuments(query);

    res.json({
      comments: commentsWithReplies,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total,
      hasNext: page * limit < total,
      hasPrev: page > 1
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Error fetching comments', error: error.message });
  }
};

// Create a new comment
const createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, parentCommentId } = req.body;
    const userId = req.authUser._id;

    // Verify post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // If it's a reply, verify parent comment exists
    if (parentCommentId) {
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) {
        return res.status(404).json({ message: 'Parent comment not found' });
      }
      if (parentComment.post.toString() !== postId) {
        return res.status(400).json({ message: 'Parent comment does not belong to this post' });
      }
    }

    const commentData = {
      post: postId,
      author: userId,
      content: content.trim(),
      parentComment: parentCommentId || null
    };

    const comment = new Comment(commentData);
    await comment.save();

    // Populate author info
    await comment.populate('author', 'name avatar');

    // Log admin activity if user is admin
    if (req.authUser.role === 'admin') {
      await createAdminLog(req.authUser._id, 'comment', 'create', comment._id);
    }

    res.status(201).json({
      message: parentCommentId ? 'Reply added successfully' : 'Comment added successfully',
      comment
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: 'Error creating comment', error: error.message });
  }
};

// Update a comment
const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.authUser._id;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user owns the comment or is admin
    if (comment.author.toString() !== userId.toString() && req.authUser.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this comment' });
    }

    comment.content = content.trim();
    await comment.save();

    await comment.populate('author', 'name avatar');

    // Log admin activity if user is admin
    if (req.authUser.role === 'admin') {
      await createAdminLog(req.authUser._id, 'comment', 'update', comment._id);
    }

    res.json({
      message: 'Comment updated successfully',
      comment
    });
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ message: 'Error updating comment', error: error.message });
  }
};

// Delete a comment (soft delete)
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.authUser._id;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user owns the comment or is admin
    if (comment.author.toString() !== userId.toString() && req.authUser.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    comment.isDeleted = true;
    comment.status = 'deleted';
    await comment.save();

    // Also soft delete all replies
    await Comment.updateMany(
      { parentComment: id },
      { isDeleted: true, status: 'deleted' }
    );

    // Log admin activity if user is admin
    if (req.authUser.role === 'admin') {
      await createAdminLog(req.authUser._id, 'comment', 'delete', comment._id);
    }

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Error deleting comment', error: error.message });
  }
};

// Toggle like on a comment
const toggleCommentLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.authUser._id;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user already liked the comment
    const existingLike = comment.likes.find(like => like.user.toString() === userId.toString());

    if (existingLike) {
      // Unlike
      comment.likes = comment.likes.filter(like => like.user.toString() !== userId.toString());
    } else {
      // Like
      comment.likes.push({ user: userId });
    }

    await comment.save();

    res.json({
      message: existingLike ? 'Comment unliked' : 'Comment liked',
      likeCount: comment.likes.length,
      userLiked: !existingLike
    });
  } catch (error) {
    console.error('Error toggling comment like:', error);
    res.status(500).json({ message: 'Error toggling comment like', error: error.message });
  }
};

// Get comment by ID
const getCommentById = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id)
      .populate('author', 'name avatar')
      .populate('post', 'title slug')
      .populate('likes.user', 'name avatar');

    if (!comment || comment.isDeleted) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Get replies if it's a parent comment
    let replies = [];
    if (!comment.parentComment) {
      replies = await Comment.find({
        parentComment: id,
        isDeleted: false,
        status: 'active'
      })
        .populate('author', 'name avatar')
        .populate('likes.user', 'name avatar')
        .sort({ createdAt: 1 });
    }

    res.json({
      comment,
      replies
    });
  } catch (error) {
    console.error('Error fetching comment:', error);
    res.status(500).json({ message: 'Error fetching comment', error: error.message });
  }
};

// Moderate comment (admin only)
const moderateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'flagged', 'hidden', 'deleted'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    comment.status = status;
    if (status === 'deleted') {
      comment.isDeleted = true;
    }

    await comment.save();

    // Log admin activity
    await createAdminLog(req.authUser._id, 'comment', 'moderate', comment._id, {
      action: 'status_change',
      newStatus: status
    });

    res.json({
      message: 'Comment moderated successfully',
      comment
    });
  } catch (error) {
    console.error('Error moderating comment:', error);
    res.status(500).json({ message: 'Error moderating comment', error: error.message });
  }
};

// Get comments by user (for user profile)
const getCommentsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const query = {
      author: userId,
      isDeleted: false,
      status: 'active'
    };

    const comments = await Comment.find(query)
      .populate('post', 'title slug')
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Comment.countDocuments(query);

    res.json({
      comments,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Error fetching user comments:', error);
    res.status(500).json({ message: 'Error fetching user comments', error: error.message });
  }
};

module.exports = {
  getCommentsByPost,
  createComment,
  updateComment,
  deleteComment,
  toggleCommentLike,
  getCommentById,
  moderateComment,
  getCommentsByUser
};
