const Booking = require('../models/booking');
const Service = require('../models/service');
const User = require('../models/user');
const { AppError, NotFoundError } = require('../utils/errors');

// Create a new booking
exports.createBooking = async (req, res, next) => {
  try {
    const booking = await Booking.create(req.body);
    res.status(201).json({ success: true, booking });
  } catch (err) {
    next(err);
  }
};

// Get all bookings (admin/staff)
exports.getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find().populate('user staff service');
    res.json({ success: true, bookings });
  } catch (err) {
    next(err);
  }
};

// Get bookings for a user
exports.getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.params.userId }).populate('service staff');
    res.json({ success: true, bookings });
  } catch (err) {
    next(err);
  }
};

// Update booking status
exports.updateBookingStatus = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!booking) return next(new NotFoundError('Booking not found'));
    res.json({ success: true, booking });
  } catch (err) {
    next(err);
  }
};

// Delete a booking
exports.deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return next(new NotFoundError('Booking not found'));
    res.json({ success: true, message: 'Booking deleted' });
  } catch (err) {
    next(err);
  }
}; 