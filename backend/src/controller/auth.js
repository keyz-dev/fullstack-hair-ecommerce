const User = require('../models/user');
const { userRegisterSchema, userLoginSchema, googleLoginSchema } = require('../schema/userSchema');
const { BadRequestError, ConflictError, UnauthorizedError, NotFoundError, ForbiddenError } = require('../utils/errors');
const { generateToken } = require('../utils/jwtToken');
const axios = require('axios');
const { cleanUpFileImages } = require('../utils/imageCleanup');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/sendVerificationEmail');
const formatUserData = require('../utils/returnFormats/userData');
const { normalizePhoneNumber } = require('../utils/phoneValidation');

// Register user  
exports.register = async (req, res, next) => {
  try{
    const { error } = userRegisterSchema.validate(req.body);
    if (error) return next(new BadRequestError(error.details[0].message));
  
    const { email, phone, ...userData } = req.body;
    let user = await User.findOne({ email });
    if (user) return next(new ConflictError('User already exists with this email'));
    
    let role = 'client';
    let authProvider = 'local';
    let isVerified = false;
    let avatar = undefined;

    // Normalize phone number
    const normalizedPhone = normalizePhoneNumber(phone);

    if (req.file) avatar = req.file.path;
    user = new User({ ...userData, email, phone: normalizedPhone, avatar, role, authProvider, isVerified });
    await user.save();

    try {
      await sendVerificationEmail(user, email, user.name);
    } catch (err) {
      await user.deleteOne();
      if(req.file) await cleanUpFileImages(req);
      return next(new BadRequestError(err.message));
    }

    res.status(201).json({
      status: "success",
      message: "Registration successful. Please verify your email.",
      data: {
        user: {
          id: user.id,
          email: user.email,
        },
      },
    });
  } catch (error) {
    if(req.file) await cleanUpFileImages(req);
    next(error);
  }
};

// Login user
exports.login = async (req, res, next) => {
  try{
    const { error } = userLoginSchema.validate(req.body);
    if (error) return next(new BadRequestError(error.details[0].message));
  
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) return next(new UnauthorizedError('Invalid email or password'));
  
    if (user.authProvider === "google" && !user.password) {
      throw new UnauthorizedError("Please Continue with Google Sign In");
    }
    const match = await user.comparePassword(password);
    if (!match) return next(new UnauthorizedError('Invalid email or password'));
  
    if (!user.isActive) return next(new ForbiddenError('Your account is not active'));
    await sendVerificationEmail(user, email, user.name)
    res.status(209).json({
      status: "success",
      message: "Login successful. Please verify your email.",
      data: {
        user: {
          id: user.id,
          email: user.email,
        },
      },
    });
  } catch(err){
    return next(err);
  }
};

// Google OAuth login
exports.googleLogin = async (req, res, next) => {
  try{
    const { error } = googleLoginSchema.validate(req.body);
    if (error) return next(new BadRequestError(error.details[0].message));
  
    const { access_token } = req.body;
    let role = 'client';
  
    if (!access_token) return next(new NotFoundError("Access token not found"));
  
    // 1. Validate token & get user profile from Google
    const response = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );
    const { email, name, picture } = response.data;

    if (!email) return next(new NotFoundError("Email not available from Google"));
  
    let user = await User.findOne({ email });
  
    if (!user) {
      // Create new user
      user = await User.create({
        email,
        name,
        avatar: picture,
        authProvider: "google",
        isVerified: true,
        isActive: true,
        role,
      });
    }
  
    // Generate token
    const authToken = user.generateAuthToken()
  
    res.json({
      status: "success",
      data: {
        user: formatUserData(user),
        token: authToken,
      },
    });
  } catch (err) {
    return next(err);
  }
};

// Verify token
exports.verifyToken = async (req, res, next) => {
  const user  = req.authUser;
  res.status(200).json({
    status: "success",
    message: "Token verified",
    valid: true,
    data: {
      user: formatUserData(user),
    },
  });
}

// Resend verification email
exports.resendVerificationEmail = async (req, res, next) => {
  try{
    const { email } = req.body;
    const user = await User.findOne({ email, isVerified: false });
    if (!user) return next(new NotFoundError('User not found'));
    await sendVerificationEmail(user, email, user.name);
  
    res.status(200).json({
      status: "success",
      message: "Verification email sent",
    });
  } catch (err) {
    return next(err);
  }
}

// Verify email
exports.verifyEmail = async (req, res, next) => {
  const { email, code } = req.body;
  const user = await User.findOne({ email, emailVerificationCode: code, emailVerificationCodeExpiresAt: { $gt: Date.now() } });
  if (!user) return next(new NotFoundError('Invalid verification code'));

  await user.updateOne({
    isVerified: true,
    emailVerificationCode: null,
    emailVerificationCodeExpiresAt: null,
  });

  const token = user.generateAuthToken();
  res.status(200).json({
    status: "success",
    message: "Email verified",
    data: {
      user: formatUserData(user),
      token,
    },
  });
}

// Forgot Password
exports.forgotPassword = async (req, res, next) => {
  try{
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return next(new NotFoundError('User not found'));

    await sendPasswordResetEmail(user, email, user.name);

    res.status(200).json({
      status: "success",
      message: "Password reset email sent",
    });
  } catch (err) {
    return next(err);
  }
}

// Reset Password
exports.resetPassword = async (req, res, next) => {
  try {
    const { newPassword, confirmPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return next(new BadRequestError('New password must be at least 6 characters.'));
    }
    if (newPassword !== confirmPassword) {
      return next(new BadRequestError('Passwords do not match.'));
    }
    const user = req.resetUser;
    user.password = newPassword;
    user.passwordResetToken = null;
    user.passwordResetTokenExpiresAt = null;
    await user.save();
    res.status(200).json({
      status: 'success',
      message: 'Password has been reset successfully. Please log in with your new password.',
    });
  } catch (err) {
    return next(err);
  }
};