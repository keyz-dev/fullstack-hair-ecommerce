const PaymentMethod = require('../models/paymentMethod');
const { BadRequestError, NotFoundError } = require('../utils/errors');
const { paymentMethodCreateSchema, paymentMethodUpdateSchema, paymentMethodConfigUpdateSchema } = require('../schema/paymentMethodSchema');
const { cleanUpFileImages } = require('../utils/imageCleanup');
const { formatPaymentMethodData } = require('../utils/returnFormats/paymentMethodData');

// Get all payment methods
const getAllPaymentMethods = async (req, res, next) => {
  try {
    const paymentMethods = await PaymentMethod.find().sort({ sortOrder: 1, name: 1 });
    res.status(200).json({ success: true, paymentMethods: paymentMethods.map(formatPaymentMethodData) });
  } catch (err) {
    next(err);
  }
};

// Get active payment methods
const getActivePaymentMethods = async (req, res, next) => {
  try {
    const paymentMethods = await PaymentMethod.find({ isActive: true }).sort({ sortOrder: 1, name: 1 });
    res.status(200).json({ success: true, paymentMethods: paymentMethods.map(formatPaymentMethodData) });
  } catch (err) {
    next(err);
  }
};

// Get payment method by ID
const getPaymentMethodById = async (req, res, next) => {
  try {
    const paymentMethod = await PaymentMethod.findById(req.params.id);
    if (!paymentMethod) {
      throw new NotFoundError('Payment method not found');
    }
    res.status(200).json({ success: true, paymentMethod: formatPaymentMethodData(paymentMethod) });
  } catch (err) {
    next(err);
  }
};

// Create new payment method
const createPaymentMethod = async (req, res, next) => {
  try {
    const { error } = paymentMethodCreateSchema.validate(req.body);
    if (error) throw new BadRequestError(error.details[0].message);

    // Check if payment method code already exists
    const existingPaymentMethod = await PaymentMethod.findOne({ code: req.body.code });
    if (existingPaymentMethod) {
      throw new BadRequestError('Payment method code already exists');
    }

    // Ensure payment methods that require setup start as inactive
    const paymentMethodData = {
      ...req.body,
      icon: req.file ? req.file.path : null,
    };
    
    // If setup is required, ensure it starts as inactive
    if (paymentMethodData.requiresSetup) {
      paymentMethodData.isActive = false;
    }
    
    const paymentMethod = await PaymentMethod.create(paymentMethodData);
    res.status(201).json({ success: true, paymentMethod: formatPaymentMethodData(paymentMethod) });
  } catch (err) {
    if (req.file) {
      await cleanUpFileImages(req);
    }
    next(err);
  }
};

// Update payment method
const updatePaymentMethod = async (req, res, next) => {
  try {
    const { error } = paymentMethodUpdateSchema.validate(req.body);
    if (error) throw new BadRequestError(error.details[0].message);

    const paymentMethod = await PaymentMethod.findById(req.params.id);
    if (!paymentMethod) {
      throw new NotFoundError('Payment method not found');
    }

    // Check if payment method code already exists (if updating code)
    if (req.body.code && req.body.code !== paymentMethod.code) {
      const existingPaymentMethod = await PaymentMethod.findOne({ code: req.body.code });
      if (existingPaymentMethod) {
        throw new BadRequestError('Payment method code already exists');
      }
    }

    Object.assign(paymentMethod, {
      ...req.body,
      icon: req.file ? req.file.path : null,
    });
    await paymentMethod.save();
    res.status(200).json({ success: true, paymentMethod: formatPaymentMethodData(paymentMethod) });
  } catch (err) {
    if (req.file) {
      await cleanUpFileImages(req);
    }
    next(err);
  }
};

// Update payment method configuration
const updatePaymentMethodConfig = async (req, res, next) => {
  try {
    console.log('Update config request body:', req.body);
    console.log('Payment method ID:', req.params.id);
    
    const { error } = paymentMethodConfigUpdateSchema.validate(req.body);
    if (error) {
      console.log('Validation error:', error.details[0].message);
      throw new BadRequestError(error.details[0].message);
    }

    const paymentMethod = await PaymentMethod.findById(req.params.id);
    if (!paymentMethod) {
      throw new NotFoundError('Payment method not found');
    }

    console.log('Current payment method config:', paymentMethod.config);
    console.log('New config to be set:', req.body.config);

    // Update only the configuration
    paymentMethod.config = req.body.config;
    
    // Automatically activate the payment method if it's properly configured
    // This ensures that once a payment method is fully configured, it becomes available to customers
    if (paymentMethod.requiresSetup && paymentMethod.isConfigured()) {
      paymentMethod.isActive = true;
    }
    
    await paymentMethod.save();
    
    const isConfigured = paymentMethod.isConfigured();
    const message = isConfigured 
      ? 'Payment method configured and activated successfully'
      : 'Payment method configuration updated successfully';
    
    res.status(200).json({ 
      success: true, 
      paymentMethod: formatPaymentMethodData(paymentMethod),
      message
    });
  } catch (err) {
    next(err);
  }
};

// Verify payment method configuration
const verifyPaymentMethodConfig = async (req, res, next) => {
  try {
    const paymentMethod = await PaymentMethod.findById(req.params.id);
    if (!paymentMethod) {
      throw new NotFoundError('Payment method not found');
    }

    const isConfigured = paymentMethod.isConfigured();
    
    res.status(200).json({ 
      success: true, 
      isConfigured,
      message: isConfigured ? 'Payment method is properly configured' : 'Payment method requires configuration'
    });
  } catch (err) {
    next(err);
  }
};

// Get payment method types
const getPaymentMethodTypes = async (req, res, next) => {
  try {
    const types = [
      {
        value: 'MOBILE_MONEY',
        label: 'Mobile Money',
        description: 'Mobile money services like MTN Momo, Orange Money',
        requiresSetup: true,
        isOnline: false,
        defaultCustomerFields: [
          { name: 'phoneNumber', label: 'Phone Number', type: 'phone', required: true },
          { name: 'provider', label: 'Provider', type: 'select', required: true, options: ['MTN', 'ORANGE'] }
        ]
      },
      {
        value: 'BANK_TRANSFER',
        label: 'Bank Transfer',
        description: 'Direct bank transfers',
        requiresSetup: true,
        isOnline: false,
        defaultCustomerFields: [
          { name: 'accountNumber', label: 'Account Number', type: 'text', required: true },
          { name: 'accountName', label: 'Account Name', type: 'text', required: true }
        ]
      },
      {
        value: 'CARD_PAYMENT',
        label: 'Card Payment',
        description: 'Credit/Debit card payments',
        requiresSetup: true,
        isOnline: true,
        defaultCustomerFields: [
          { name: 'cardNumber', label: 'Card Number', type: 'text', required: true },
          { name: 'expiryDate', label: 'Expiry Date', type: 'text', required: true },
          { name: 'cvv', label: 'CVV', type: 'text', required: true },
          { name: 'cardholderName', label: 'Cardholder Name', type: 'text', required: true }
        ]
      },
      {
        value: 'PAYPAL',
        label: 'PayPal',
        description: 'PayPal payments',
        requiresSetup: true,
        isOnline: true,
        defaultCustomerFields: [
          { name: 'paypalEmail', label: 'PayPal Email', type: 'email', required: true }
        ]
      },
      {
        value: 'CRYPTO',
        label: 'Cryptocurrency',
        description: 'Cryptocurrency payments',
        requiresSetup: true,
        isOnline: true,
        defaultCustomerFields: [
          { name: 'walletAddress', label: 'Wallet Address', type: 'text', required: true },
          { name: 'network', label: 'Network', type: 'select', required: true, options: ['Bitcoin', 'Ethereum', 'USDT'] }
        ]
      },
      {
        value: 'CASH_ON_DELIVERY',
        label: 'Cash on Delivery',
        description: 'Pay when you receive the item',
        requiresSetup: false,
        isOnline: false,
        defaultCustomerFields: []
      },
      {
        value: 'OTHER',
        label: 'Other',
        description: 'Custom payment method',
        requiresSetup: true,
        isOnline: false,
        defaultCustomerFields: []
      }
    ];

    res.status(200).json({ success: true, types });
  } catch (err) {
    next(err);
  }
};

// Delete payment method
const deletePaymentMethod = async (req, res, next) => {
  try {
    const paymentMethod = await PaymentMethod.findById(req.params.id);
    if (!paymentMethod) {
      throw new NotFoundError('Payment method not found');
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
      throw new NotFoundError('Payment method not found');
    }

    paymentMethod.isActive = !paymentMethod.isActive;
    await paymentMethod.save();
    res.status(200).json({ success: true, paymentMethod: formatPaymentMethodData(paymentMethod) });
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
  updatePaymentMethodConfig,
  verifyPaymentMethodConfig,
  getPaymentMethodTypes,
  deletePaymentMethod,
  togglePaymentMethodStatus,
}; 