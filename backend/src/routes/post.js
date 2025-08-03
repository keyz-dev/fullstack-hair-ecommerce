const express = require('express');
const router = express.Router();
const { authenticateUser, authorizeRoles } = require('../middleware/auth');
const { upload, handleCloudinaryUpload, formatFilePaths, handleUploadError } = require('../middleware/multer');

const {
  getAllPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  getPostAnalytics,
  getFeaturedPosts,
  getPostsByCategory,
  getPostStats
} = require('../controller/post');

// Public routes
router.get('/', getAllPosts);
router.get('/featured', getFeaturedPosts);
router.get('/category/:categoryId', getPostsByCategory);
router.get('/:slug', getPostBySlug);

// Protected routes (require authentication)
router.post('/:id/like', authenticateUser, toggleLike);
// Note: Comments now handled by /api/comments routes

// Admin routes (require admin privileges)
router.get('/admin/stats', authenticateUser, authorizeRoles(['admin']), getPostStats);
router.post('/', authenticateUser, authorizeRoles(['admin']), upload.fields([
  { name: 'postImages', maxCount: 10 },
  { name: 'postVideo', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]), handleUploadError, handleCloudinaryUpload, formatFilePaths, createPost);

router.put('/:id', authenticateUser, authorizeRoles(['admin']), upload.fields([
  { name: 'postImages', maxCount: 10 },
  { name: 'postVideo', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]), handleUploadError, handleCloudinaryUpload, formatFilePaths, updatePost);

router.delete('/:id', authenticateUser, authorizeRoles(['admin']), deletePost);
router.get('/:id/analytics', authenticateUser, authorizeRoles(['admin']), getPostAnalytics);

module.exports = router; 