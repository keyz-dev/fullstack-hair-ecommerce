const Settings = require('../models/settings');
const { BadRequestError } = require('../utils/errors');
const logger = require('../utils/logger');

// Default settings to create if they don't exist
const DEFAULT_SETTINGS = [
  { key: 'default_currency', value: 'XAF', description: 'Default currency for the application', category: 'general', isPublic: true },
  { key: 'default_language', value: 'en', description: 'Default language for the application', category: 'general', isPublic: true },
  { key: 'order_auto_approval', value: false, description: 'Automatically approve new orders', category: 'general', isPublic: false },
  { key: 'email_notifications', value: true, description: 'Send email notifications for new orders', category: 'notification', isPublic: false },
  { key: 'stock_management', value: true, description: 'Enable automatic stock management', category: 'general', isPublic: false },
];

// Ensure default settings exist
const ensureDefaultSettings = async () => {
  try {
    for (const defaultSetting of DEFAULT_SETTINGS) {
      const existingSetting = await Settings.findOne({ key: defaultSetting.key });
      if (!existingSetting) {
        await Settings.create(defaultSetting);
        logger.info(`Created default setting: ${defaultSetting.key}`);
      }
    }
  } catch (error) {
    logger.error('Error ensuring default settings:', error);
  }
};

// Get all public or all settings (admin)
const getSettings = async (req, res, next) => {
  try {
    // Ensure default settings exist
    await ensureDefaultSettings();
    
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
        { new: true, upsert: true }
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