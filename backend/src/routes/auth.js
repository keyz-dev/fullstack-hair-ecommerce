const express = require('express');
const { upload, handleCloudinaryUpload, formatFilePaths } = require('../middleware/multer');
const { validate } = require('../middleware/validate');
const { userRegisterSchema, userLoginSchema, googleLoginSchema } = require('../schema/userSchema');
const authController = require('../controller/auth');
const { validatePasswordResetToken } = require('../middleware/validate');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

router.post('/register', upload.single('avatar'), handleCloudinaryUpload, formatFilePaths, validate(userRegisterSchema), authController.register);
router.post('/login', validate(userLoginSchema), authController.login);
router.post('/google-oauth', validate(googleLoginSchema), authController.googleLogin);
router.post('/resend-verification-email', authController.resendVerificationEmail);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', validatePasswordResetToken, authController.resetPassword);
router.post('/verify-email/', authController.verifyEmail);

router.get('/verify-token', authenticateUser, authController.verifyToken);

module.exports = router;
