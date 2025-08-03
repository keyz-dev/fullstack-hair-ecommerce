const Settings = require('../models/settings');
const { BadRequestError } = require('../utils/errors');
const logger = require('../utils/logger');

// Get all public or all settings (admin)
const getSettings = async (req, res, next) => {
  try {
    // If admin, return all; else only public
    const isAdmin = req.authUser && req.authUser.role === 'admin';
    const query = isAdmin ? {} : { isPublic: true };
    const settings = await Settings.find(query);
    res.status(200).json({ success: true, settings });
  } catch (err) {
    next(err);
  }
};

// Update multiple settings
const updateSettings = async (req, res, next) => {
  try {
    const updates = req.body.settings;
    if (!Array.isArray(updates)) {
      return next(new BadRequestError('Settings must be an array'));
    }
    const results = [];
    for (const update of updates) {
      const { key, value } = update;
      if (!key) continue;
      const setting = await Settings.findOneAndUpdate(
        { key },
        { value },
        { new: true }
      );
      if (setting) results.push(setting);
    }
    res.status(200).json({ success: true, settings: results });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getSettings,
  updateSettings,
}; 