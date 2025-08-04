const express = require('express');
const { upload, handleCloudinaryUpload, formatFilePaths } = require('../middleware/multer');
const { authenticateUser } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { userUpdateSchema, userPasswordUpdateSchema } = require('../schema/userSchema');
const userController = require('../controller/user');

const router = express.Router();

// Profile management routes
router.get('/profile', authenticateUser, userController.getUserProfile);
router.put('/profile', authenticateUser, validate(userUpdateSchema), userController.updateProfile);
router.put('/password', authenticateUser, validate(userPasswordUpdateSchema), userController.updatePassword);

// Avatar management routes
router.put('/avatar', authenticateUser, upload.single('avatar'), handleCloudinaryUpload, formatFilePaths, userController.updateAvatar);
router.delete('/avatar', authenticateUser, userController.deleteAvatar);

// User statistics and preferences
router.get('/stats', authenticateUser, userController.getUserStats);
router.put('/preferences', authenticateUser, userController.updatePreferences);

module.exports = router;
