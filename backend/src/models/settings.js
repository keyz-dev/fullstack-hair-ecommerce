const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    enum: ['general', 'payment', 'currency', 'email', 'notification', 'security'],
    default: 'general',
  },
  isPublic: {
    type: Boolean,
    default: false, // Whether this setting can be accessed without auth
  },
}, { timestamps: true });

// Index for efficient lookups
settingsSchema.index({ category: 1 });

module.exports = mongoose.model('Settings', settingsSchema); 