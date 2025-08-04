const User = require('../models/user');
const { BadRequestError, NotFoundError } = require('../utils/errors');
const { userUpdateSchema, userPasswordUpdateSchema } = require('../schema/userSchema');
const { cleanUpInstanceImages, cleanUpFileImages } = require('../utils/imageCleanup');
const formatUserData = require('../utils/returnFormats/userData');

// Get currently logged in user profile
exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.authUser._id)
      .select('-password')
      .populate('addresses');
    
    if (!user) {
      return next(new NotFoundError('User not found'));
    }
    
    res.status(200).json({ 
      success: true, 
      data: formatUserData(user) 
    });
  } catch (error) {
    next(error);
  }
};

// Update user profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { error } = userUpdateSchema.validate(req.body);
    if (error) {
      return next(new BadRequestError(error.details[0].message));
    }

    const user = await User.findById(req.authUser._id);
    if (!user) {
      return next(new NotFoundError('User not found'));
    }

    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      dateOfBirth,
      gender,
      bio,
      preferences 
    } = req.body;

    // Update fields if provided
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email && email !== user.email) {
      // Check if email is already taken
      const existingUser = await User.findOne({ email, _id: { $ne: user._id } });
      if (existingUser) {
        return next(new BadRequestError('Email is already in use'));
      }
      user.email = email;
      user.emailVerified = false; // Require re-verification
    }
    if (phone) user.phone = phone;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (gender) user.gender = gender;
    if (bio !== undefined) user.bio = bio;
    if (preferences) user.preferences = { ...user.preferences, ...preferences };

    await user.save();
    
    res.status(200).json({ 
      success: true, 
      message: 'Profile updated successfully', 
      data: formatUserData(user) 
    });
  } catch (error) {
    await cleanUpFileImages(req)
    next(error);
  }
};

// Update user password
exports.updatePassword = async (req, res, next) => {
  try {
    const { error } = userPasswordUpdateSchema.validate(req.body);
    if (error) {
      return next(new BadRequestError(error.details[0].message));
    }

    const { oldPassword, newPassword } = req.body;
    
    const user = await User.findById(req.authUser._id).select('+password');
    if (!user) {
      return next(new NotFoundError('User not found'));
    }

    const isPasswordValid = await user.comparePassword(oldPassword);
    if (!isPasswordValid) {
      return next(new BadRequestError('Current password is incorrect'));
    }

    user.password = newPassword;
    await user.save();
    
    res.status(200).json({ 
      success: true, 
      message: 'Password updated successfully' 
    });
  } catch (error) {
    next(error);
  }
};

// Update user avatar
exports.updateAvatar = async (req, res, next) => {
  try {
    const user = await User.findById(req.authUser._id);
    if (!user) {
      return next(new NotFoundError('User not found'));
    }

    if (!req.file) {
      return next(new BadRequestError('Please upload an image'));
    }

    // Clean up old avatar if exists
    if (user.avatar) {
      await cleanUpInstanceImages(user);
    }

    user.avatar = req.file.path;
    await user.save();
    
    res.status(200).json({ 
      success: true, 
      message: 'Avatar updated successfully', 
      data: { avatar: user.avatar } 
    });
  } catch (error) {
    if(req.file || req.files) await cleanUpFileImages(req)
    next(error);
  }
};

// Delete user avatar
exports.deleteAvatar = async (req, res, next) => {
  try {
    const user = await User.findById(req.authUser._id);
    if (!user) {
      return next(new NotFoundError('User not found'));
    }

    if (user.avatar) {
      await cleanUpInstanceImages(user);
      user.avatar = null;
      await user.save();
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Avatar removed successfully' 
    });
  } catch (error) {
    next(error);
  }
};

// Get user activity/stats
exports.getUserStats = async (req, res, next) => {
  try {
    const user = await User.findById(req.authUser._id);
    if (!user) {
      return next(new NotFoundError('User not found'));
    }

    // Get user statistics (orders, reviews, etc.)
    const stats = {
      totalOrders: 0, // TODO: Implement order counting
      totalReviews: 0, // TODO: Implement review counting
      memberSince: user.createdAt,
      lastLogin: user.lastLogin || user.createdAt,
      emailVerified: user.isVerified,
      profileComplete: !!(user.name && user.email && user.phone)
    };
    
    res.status(200).json({ 
      success: true, 
      data: stats 
    });
  } catch (error) {
    next(error);
  }
};

// Update user preferences
exports.updatePreferences = async (req, res, next) => {
  try {
    const { preferences } = req.body;
    
    if (!preferences || typeof preferences !== 'object') {
      return next(new BadRequestError('Preferences object is required'));
    }

    const user = await User.findById(req.authUser._id);
    if (!user) {
      return next(new NotFoundError('User not found'));
    }

    user.preferences = { ...user.preferences, ...preferences };
    await user.save();
    
    res.status(200).json({ 
      success: true, 
      message: 'Preferences updated successfully', 
      data: { preferences: user.preferences } 
    });
  } catch (error) {
    next(error);
  }
};
