const Currency = require('../models/currency');
const PaymentMethod = require('../models/paymentMethod');
const Settings = require('../models/settings');
const logger = require('./logger');

const defaultCurrencies = [
  {
    code: 'XAF',
    name: 'Central African CFA Franc',
    symbol: 'FCFA',
    exchangeRate: 1.0,
    isBase: true,
    isActive: true,
    position: 'before',
  },
  {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    exchangeRate: 0.0016, // Approximate rate to XAF
    isBase: false,
    isActive: true,
    position: 'before',
  },
  {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    exchangeRate: 0.0015, // Approximate rate to XAF
    isBase: false,
    isActive: true,
    position: 'before',
  },
  {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    exchangeRate: 0.0013, // Approximate rate to XAF
    isBase: false,
    isActive: true,
    position: 'before',
  },
];

const defaultPaymentMethods = [
  {
    name: 'Cash on Delivery',
    code: 'CASH_ON_DELIVERY',
    description: 'Pay with cash when your order is delivered',
    icon: 'cash',
    isActive: true,
    isOnline: false,
    requiresSetup: false,
    supportedCurrencies: ['XAF', 'USD', 'EUR', 'GBP'],
    fees: 0,
    minAmount: 0,
    maxAmount: null,
    sortOrder: 1,
  },
  {
    name: 'Mobile Money',
    code: 'MOBILE_MONEY',
    description: 'Pay using mobile money services',
    icon: 'mobile',
    isActive: true,
    isOnline: true,
    requiresSetup: true,
    supportedCurrencies: ['XAF'],
    fees: 0.5,
    minAmount: 100,
    maxAmount: 500000,
    sortOrder: 2,
  },
  {
    name: 'Bank Transfer',
    code: 'BANK_TRANSFER',
    description: 'Pay via bank transfer',
    icon: 'bank',
    isActive: true,
    isOnline: true,
    requiresSetup: true,
    supportedCurrencies: ['XAF', 'USD', 'EUR'],
    fees: 0,
    minAmount: 1000,
    maxAmount: null,
    sortOrder: 3,
  },
  {
    name: 'Credit Card',
    code: 'CREDIT_CARD',
    description: 'Pay with credit or debit card',
    icon: 'card',
    isActive: true,
    isOnline: true,
    requiresSetup: true,
    supportedCurrencies: ['XAF', 'USD', 'EUR', 'GBP'],
    fees: 2.5,
    minAmount: 100,
    maxAmount: null,
    sortOrder: 4,
  },
];

const defaultSettings = [
  {
    key: 'default_currency',
    value: 'XAF',
    description: 'Default currency for the application',
    category: 'currency',
    isPublic: true,
  },
  {
    key: 'default_language',
    value: 'en',
    description: 'Default language for the application',
    category: 'general',
    isPublic: true,
  },
  {
    key: 'order_auto_approval',
    value: false,
    description: 'Whether orders are automatically approved',
    category: 'general',
    isPublic: false,
  },
  {
    key: 'email_notifications',
    value: true,
    description: 'Send email notifications for new orders',
    category: 'notification',
    isPublic: false,
  },
  {
    key: 'stock_management',
    value: true,
    description: 'Enable automatic stock management',
    category: 'general',
    isPublic: false,
  },
  {
    key: 'currency_update_frequency',
    value: 'daily',
    description: 'How often to update exchange rates',
    category: 'currency',
    isPublic: false,
  },
  {
    key: 'payment_gateway_enabled',
    value: true,
    description: 'Whether payment gateway is enabled',
    category: 'payment',
    isPublic: false,
  },
];

const seedCurrencies = async () => {
  try {
        logger.info('Seeding currencies...');
    for (const currency of defaultCurrencies) {
      const exists = await Currency.findOne({ code: currency.code });
      if (!exists) {
        await Currency.create(currency);
                logger.info(`Created currency: ${currency.code}`);
      } else {
                logger.info(`Currency ${currency.code} already exists`);
      }
    }
        logger.info('Currency seeding completed');
  } catch (error) {
        logger.error('Error seeding currencies:', error);
  }
};

const seedPaymentMethods = async () => {
  try {
        logger.info('Seeding payment methods...');
    for (const method of defaultPaymentMethods) {
      const exists = await PaymentMethod.findOne({ code: method.code });
      if (!exists) {
        await PaymentMethod.create(method);
                logger.info(`Created payment method: ${method.name}`);
      } else {
                logger.info(`Payment method ${method.name} already exists`);
      }
    }
        logger.info('Payment method seeding completed');
  } catch (error) {
        logger.error('Error seeding payment methods:', error);
  }
};

const seedSettings = async () => {
  try {
        logger.info('Seeding settings...');
    for (const setting of defaultSettings) {
      const exists = await Settings.findOne({ key: setting.key });
      if (!exists) {
        await Settings.create(setting);
                logger.info(`Created setting: ${setting.key}`);
      } else {
                logger.info(`Setting ${setting.key} already exists`);
      }
    }
        logger.info('Settings seeding completed');
  } catch (error) {
        logger.error('Error seeding settings:', error);
  }
};

const seedAll = async () => {
    logger.info('Starting data seeding...');
  await seedCurrencies();
  await seedPaymentMethods();
  await seedSettings();
    logger.info('Data seeding completed');
};

module.exports = {
  seedCurrencies,
  seedPaymentMethods,
  seedSettings,
  seedAll,
}; 