const express = require('express');
const router = express.Router();
const { authenticateUser, authorizeRoles } = require('../middleware/auth');
const {
  getCommentsByPost,
  createComment,
  updateComment,
  deleteComment,
  toggleCommentLike,
  getCommentById,
  moderateComment,
  getCommentsByUser
} = require('../controller/comment');

// Public routes
router.get('/post/:postId', getCommentsByPost); // Get all comments for a post
router.get('/:id', getCommentById); // Get single comment with replies
router.get('/user/:userId', getCommentsByUser); // Get comments by user

// Protected routes (require authentication)
router.post('/post/:postId', authenticateUser, createComment); // Create comment or reply
router.put('/:id', authenticateUser, updateComment); // Update own comment
router.delete('/:id', authenticateUser, deleteComment); // Delete own comment
router.post('/:id/like', authenticateUser, toggleCommentLike); // Like/unlike comment

// Admin routes (require admin privileges)
router.put('/:id/moderate', authenticateUser, authorizeRoles(['admin']), moderateComment); // Moderate comment

module.exports = router;
