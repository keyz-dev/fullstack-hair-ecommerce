const mongoose = require('mongoose');
const addressSchema = require('./address');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // Allow guest users
  },
  // Guest user information (when user is not provided)
  guestInfo: {
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    email: { type: String, required: false },
    phone: { type: String, required: false },
  },
  orderItems: [orderItemSchema],
  shippingAddress: addressSchema,
  paymentMethod: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PaymentMethod',
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  },
  paymentTime: Date,
  status: {
    type: String,
    enum: ['pending', 'accepted', 'ready', 'delivered', 'cancelled'],
    default: 'pending',
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  subtotal: {
    type: Number,
    required: true,
  },
  shipping: {
    type: Number,
    required: true,
    default: 0,
  },
  tax: {
    type: Number,
    required: true,
    default: 0,
  },
  processingFee: {
    type: Number,
    required: true,
    default: 0,
  },
  notes: {
    type: String,
    required: false,
  },
  isDelivered: {
    type: Boolean,
    default: false,
  },
  deliveredAt: Date,
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
