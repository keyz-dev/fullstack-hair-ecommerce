const PaymentMethod = require('../models/paymentMethod');
const { BadRequestError, NotFoundError } = require('../utils/errors');
const { paymentMethodCreateSchema, paymentMethodUpdateSchema } = require('../schema/paymentMethodSchema');

// Get all payment methods
const getAllPaymentMethods = async (req, res, next) => {
  try {
    const paymentMethods = await PaymentMethod.find().sort({ sortOrder: 1, name: 1 });
    res.status(200).json({ success: true, paymentMethods });
  } catch (err) {
    next(err);
  }
};

// Get active payment methods
const getActivePaymentMethods = async (req, res, next) => {
  try {
    const paymentMethods = await PaymentMethod.find({ isActive: true }).sort({ sortOrder: 1, name: 1 });
    res.status(200).json({ success: true, paymentMethods });
  } catch (err) {
    next(err);
  }
};

// Get payment method by ID
const getPaymentMethodById = async (req, res, next) => {
  try {
    const paymentMethod = await PaymentMethod.findById(req.params.id);
    if (!paymentMethod) {
      return next(new NotFoundError('Payment method not found'));
    }
    res.status(200).json({ success: true, paymentMethod });
  } catch (err) {
    next(err);
  }
};

// Create new payment method
const createPaymentMethod = async (req, res, next) => {
  try {
    const { error } = paymentMethodCreateSchema.validate(req.body);
    if (error) return next(new BadRequestError(error.details[0].message));

    // Check if payment method code already exists
    const existingPaymentMethod = await PaymentMethod.findOne({ code: req.body.code });
    if (existingPaymentMethod) {
      return next(new BadRequestError('Payment method code already exists'));
    }

    const paymentMethod = await PaymentMethod.create(req.body);
    res.status(201).json({ success: true, paymentMethod });
  } catch (err) {
    next(err);
  }
};

// Update payment method
const updatePaymentMethod = async (req, res, next) => {
  try {
    const { error } = paymentMethodUpdateSchema.validate(req.body);
    if (error) return next(new BadRequestError(error.details[0].message));

    const paymentMethod = await PaymentMethod.findById(req.params.id);
    if (!paymentMethod) {
      return next(new NotFoundError('Payment method not found'));
    }

    // Check if payment method code already exists (if updating code)
    if (req.body.code && req.body.code !== paymentMethod.code) {
      const existingPaymentMethod = await PaymentMethod.findOne({ code: req.body.code });
      if (existingPaymentMethod) {
        return next(new BadRequestError('Payment method code already exists'));
      }
    }

    Object.assign(paymentMethod, req.body);
    await paymentMethod.save();
    res.status(200).json({ success: true, paymentMethod });
  } catch (err) {
    next(err);
  }
};

// Delete payment method
const deletePaymentMethod = async (req, res, next) => {
  try {
    const paymentMethod = await PaymentMethod.findById(req.params.id);
    if (!paymentMethod) {
      return next(new NotFoundError('Payment method not found'));
    }

    await PaymentMethod.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Payment method deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// Toggle payment method status
const togglePaymentMethodStatus = async (req, res, next) => {
  try {
    const paymentMethod = await PaymentMethod.findById(req.params.id);
    if (!paymentMethod) {
      return next(new NotFoundError('Payment method not found'));
    }

    paymentMethod.isActive = !paymentMethod.isActive;
    await paymentMethod.save();
    res.status(200).json({ success: true, paymentMethod });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllPaymentMethods,
  getActivePaymentMethods,
  getPaymentMethodById,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
  togglePaymentMethodStatus,
}; 