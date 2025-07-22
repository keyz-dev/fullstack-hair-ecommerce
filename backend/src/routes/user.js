const express = require('express');
const { upload, handleCloudinaryUpload, formatFilePaths } = require('../middleware/multer');
const { authenticateUser } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { userUpdateSchema } = require('../schema/userSchema');
const userController = require('../controller/user');

const router = express.Router();

router.get('/profile', authenticateUser, userController.getUserProfile);
router.put('/update', authenticateUser, validate(userUpdateSchema), userController.updateProfile);
router.put('/avatar', authenticateUser, upload.single('avatar'), handleCloudinaryUpload, formatFilePaths, userController.updateAvatar);
router.put('/password', authenticateUser, userController.updatePassword);

module.exports = router;
