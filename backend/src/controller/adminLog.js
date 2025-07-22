const AdminLog = require('../models/adminLog');
const { AppError, NotFoundError } = require('../utils/errors');

// Log an admin action
exports.logAction = async (req, res, next) => {
  try {
    const log = await AdminLog.create(req.body);
    res.status(201).json({ success: true, log });
  } catch (err) {
    next(err);
  }
};

// Get all admin logs
exports.getAllLogs = async (req, res, next) => {
  try {
    const logs = await AdminLog.find().populate('admin');
    res.json({ success: true, logs });
  } catch (err) {
    next(err);
  }
}; 