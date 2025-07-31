const mongoose = require('mongoose');

// Configuration schemas for different payment types
const mobileMoneyConfigSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
  },
  accountName: {
    type: String,
    required: true,
    trim: true,
  },
  provider: {
    type: String,
    enum: ['MTN', 'ORANGE', 'OTHER'],
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  }
}, { _id: false });

const bankTransferConfigSchema = new mongoose.Schema({
  accountNumber: {
    type: String,
    required: true,
    trim: true,
  },
  accountName: {
    type: String,
    required: true,
    trim: true,
  },
  bankName: {
    type: String,
    required: true,
    trim: true,
  },
  swiftCode: {
    type: String,
    trim: true,
  },
  routingNumber: {
    type: String,
    trim: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  }
}, { _id: false });

const cardPaymentConfigSchema = new mongoose.Schema({
  merchantId: {
    type: String,
    trim: true,
  },
  apiKey: {
    type: String,
    trim: true,
  },
  webhookUrl: {
    type: String,
    trim: true,
  },
  isLive: {
    type: Boolean,
    default: false,
  }
}, { _id: false });

const paypalConfigSchema = new mongoose.Schema({
  clientId: {
    type: String,
    required: true,
    trim: true,
  },
  clientSecret: {
    type: String,
    required: true,
    trim: true,
  },
  mode: {
    type: String,
    enum: ['sandbox', 'live'],
    default: 'sandbox',
  },
  webhookId: {
    type: String,
    trim: true,
  }
}, { _id: false });

const cryptoConfigSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    trim: true,
  },
  network: {
    type: String,
    required: true,
    trim: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  }
}, { _id: false });

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
    default: null,
  },
  type: {
    type: String,
    enum: ['MOBILE_MONEY', 'BANK_TRANSFER', 'CARD_PAYMENT', 'PAYPAL', 'CRYPTO', 'CASH_ON_DELIVERY', 'OTHER'],
    required: true,
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
  // Configuration fields based on payment type
  config: {
    mobileMoney: mobileMoneyConfigSchema,
    bankTransfer: bankTransferConfigSchema,
    cardPayment: cardPaymentConfigSchema,
    paypal: paypalConfigSchema,
    crypto: cryptoConfigSchema,
  },
  // Additional metadata for flexibility
  metadata: {
    type: Map,
    of: String,
    default: new Map(),
  },
  // Validation rules for customer input
  customerFields: [{
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['text', 'email', 'phone', 'number', 'select'],
      default: 'text',
    },
    required: {
      type: Boolean,
      default: false,
    },
    placeholder: String,
    options: [String], // For select type
    validation: {
      pattern: String,
      minLength: Number,
      maxLength: Number,
    }
  }],
}, { timestamps: true });

// Virtual for getting the appropriate config based on type
paymentMethodSchema.virtual('paymentConfig').get(function() {
  switch (this.type) {
    case 'MOBILE_MONEY':
      return this.config.mobileMoney;
    case 'BANK_TRANSFER':
      return this.config.bankTransfer;
    case 'CARD_PAYMENT':
      return this.config.cardPayment;
    case 'PAYPAL':
      return this.config.paypal;
    case 'CRYPTO':
      return this.config.crypto;
    default:
      return null;
  }
});

// Method to check if payment method is properly configured
paymentMethodSchema.methods.isConfigured = function() {
  if (!this.requiresSetup) return true;
  
  const config = this.paymentConfig;
  if (!config) return false;
  
  // Check if required fields are filled based on type
  switch (this.type) {
    case 'MOBILE_MONEY':
      return config.phoneNumber && config.accountName && config.provider;
    case 'BANK_TRANSFER':
      return config.accountNumber && config.accountName && config.bankName;
    case 'CARD_PAYMENT':
      return config.merchantId && config.apiKey;
    case 'PAYPAL':
      return config.clientId && config.clientSecret;
    case 'CRYPTO':
      return config.walletAddress && config.network;
    default:
      return true;
  }
};

module.exports = mongoose.model('PaymentMethod', paymentMethodSchema); 