const Notification = require('../models/notification');
const { AppError, NotFoundError } = require('../utils/errors');

// Create a notification
exports.createNotification = async (req, res, next) => {
  try {
    const notification = await Notification.create(req.body);
    res.status(201).json({ success: true, notification });
  } catch (err) {
    next(err);
  }
};

// Get all notifications for a user
exports.getUserNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.authUser._id });
    res.json({ success: true, notifications });
  } catch (err) {
    next(err);
  }
};

// Mark notification as read
exports.markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!notification) return next(new NotFoundError('Notification not found'));
    res.json({ success: true, notification });
  } catch (err) {
    next(err);
  }
};

// Delete a notification
exports.deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) return next(new NotFoundError('Notification not found'));
    res.json({ success: true, message: 'Notification deleted' });
  } catch (err) {
    next(err);
  }
}; 