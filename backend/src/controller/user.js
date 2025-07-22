const User = require('../models/user');
const { BadRequestError, NotFoundError } = require('../utils/errors');
const { userUpdateSchema } = require('../schema/userSchema');
const { cleanUpInstanceImages } = require('../utils/imageCleanup');
const formatUserData = require('../utils/returnFormats/userData')

// Get currently logged in user
exports.getUserProfile = async (req, res, next) => {
  const user = await User.findById(req.rootUser._id);
  res.status(200).json({ success: true, data: formatUserData(user) });
};

// Update user profile
exports.updateProfile = async (req, res, next) => {
  const { error } = userUpdateSchema.validate(req.body);
  if (error) return next(new BadRequestError(error.details[0].message));
  const user = await User.findById(req.rootUser._id);
  if (!user) return next(new NotFoundError('User not found'));
  const { name, email, address, avatar } = req.body;
  if (name) user.name = name;
  if (email) user.email = email;
  if (address) user.address = address;
  if (avatar) user.avatar = avatar;
  await user.save();
  res.status(200).json({ success: true, message: 'Profile updated successfully', user });
};

// Update user password
exports.updatePassword = async (req, res, next) => {
  const { error } = userUpdatePasswordSchema.validate(req.body);
  if (error) return next(new BadRequestError(error.details[0].message));
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) return next(new BadRequestError('Please provide old and new password'));
  const user = await User.findById(req.rootUser._id).select('+password');
  if (!user) return next(new NotFoundError('User not found'));
  const match = await user.comparePassword(oldPassword);
  if (!match) return next(new BadRequestError('Incorrect old password'));
  user.password = newPassword;
  await user.save();
  res.status(200).json({ success: true, message: 'Password updated successfully' });
};

// Update user avatar
exports.updateAvatar = async (req, res, next) => {
  const user = await User.findById(req.rootUser._id);
  if (!user) return next(new NotFoundError('User not found'));
  if (!req.file) return next(new BadRequestError('Please add image'));
  if (user.avatar) await cleanUpInstanceImages(user);
  user.avatar = req.file.path;
  await user.save();
  res.status(200).json({ success: true, message: 'Avatar updated successfully', avatar: user.avatar });
};
