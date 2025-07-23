const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
    default: null,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    default: null,
    select: false,
  },
  phone: {
    type: String,
    default: null,
  },
  avatar: {
    type: String,
    default: null,
  },
  address: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    enum: ['client', 'admin', 'staff'],
    default: 'client',
  },
  bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  isVerified: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local',
  },
  emailVerificationCode: {
    type: String,
    default: null,
  },
  emailVerificationCodeExpiresAt: {
    type: Date,
    default: null,
  },
  passwordResetToken: {
    type: String,
    default: null,
    select: false
  },
  passwordResetTokenExpiresAt: {
    type: Date,
    default: null,
    select: false
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT
userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME || '7d',
  });
};

module.exports = mongoose.model('User', userSchema);
