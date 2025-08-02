const express = require('express');
const router = express.Router();
const { authenticateUser, authorizeRoles } = require('../middleware/auth');
const { upload } = require('../middleware/multer');
const {
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
} = require('../controller/post');

// Public routes
router.get('/', getAllPosts);
router.get('/featured', getFeaturedPosts);
router.get('/category/:categoryId', getPostsByCategory);
router.get('/:slug', getPostBySlug);

// Protected routes (require authentication)
router.post('/:id/like', authenticateUser, toggleLike);
router.post('/:id/comment', authenticateUser, addComment);

// Admin routes (require admin privileges)
router.post('/', authenticateUser, authorizeRoles(['admin']), upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'videos', maxCount: 5 }
]), createPost);

router.put('/:id', authenticateUser, authorizeRoles(['admin']), upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'videos', maxCount: 5 }
]), updatePost);

router.delete('/:id', authenticateUser, authorizeRoles(['admin']), deletePost);
router.get('/:id/analytics', authenticateUser, authorizeRoles(['admin']), getPostAnalytics);

module.exports = router; 