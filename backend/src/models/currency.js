const mongoose = require('mongoose');

const currencySchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  symbol: {
    type: String,
    required: true,
    trim: true,
  },
  exchangeRate: {
    type: Number,
    required: true,
    default: 1.0, // Base currency (XAF) has rate of 1
  },
  isBase: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  position: {
    type: String,
    enum: ['before', 'after'],
    default: 'before', // Symbol position relative to amount
  },
}, { timestamps: true });

// Ensure only one base currency exists
currencySchema.pre('save', async function(next) {
  if (this.isBase) {
    await this.constructor.updateMany(
      { _id: { $ne: this._id } },
      { isBase: false }
    );
  }
  next();
});

module.exports = mongoose.model('Currency', currencySchema); 