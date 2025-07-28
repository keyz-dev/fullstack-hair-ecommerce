const mongoose = require('mongoose');

const paymentMethodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  icon: {
    type: String, // URL or icon name
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isOnline: {
    type: Boolean,
    default: false, // Whether it's an online payment method
  },
  requiresSetup: {
    type: Boolean,
    default: false, // Whether it requires additional setup
  },
  supportedCurrencies: [{
    type: String,
    uppercase: true,
  }],
  fees: {
    type: Number,
    default: 0, // Processing fee percentage
  },
  minAmount: {
    type: Number,
    default: 0,
  },
  maxAmount: {
    type: Number,
    default: null,
  },
  sortOrder: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model('PaymentMethod', paymentMethodSchema); 