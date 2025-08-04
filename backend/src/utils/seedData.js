const PaymentMethod = require('../models/paymentMethod');
const Settings = require('../models/settings');
const logger = require('./logger');

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
    key: 'site_name',
    value: 'BraidSter',
    description: 'Website name',
    category: 'general',
  },
  {
    key: 'site_description',
    value: 'Your premier destination for quality hair products and beauty services',
    description: 'Website description',
    category: 'general',
  },
  {
    key: 'contact_email',
    value: 'info@braidster.com',
    description: 'Contact email address',
    category: 'contact',
  },
  {
    key: 'contact_phone',
    value: '+237 6XX XXX XXX',
    description: 'Contact phone number',
    category: 'contact',
  },
  {
    key: 'default_currency',
    value: 'XAF',
    description: 'Default currency for the application',
    category: 'currency',
  },
  {
    key: 'currency_symbol_position',
    value: 'before',
    description: 'Position of currency symbol relative to amount',
    category: 'currency',
  },
  {
    key: 'currency_decimal_places',
    value: '2',
    description: 'Number of decimal places for currency display',
    category: 'currency',
  },
  {
    key: 'currency_thousand_separator',
    value: ',',
    description: 'Thousand separator for currency display',
    category: 'currency',
  },
  {
    key: 'currency_decimal_separator',
    value: '.',
    description: 'Decimal separator for currency display',
    category: 'currency',
  },
  {
    key: 'currency_update_frequency',
    value: 'daily',
    description: 'How often to update exchange rates',
    category: 'currency',
  },
  {
    key: 'payment_gateway',
    value: 'stripe',
    description: 'Default payment gateway',
    category: 'payment',
  },
  {
    key: 'shipping_fee',
    value: '1000',
    description: 'Default shipping fee in XAF',
    category: 'shipping',
  },
  {
    key: 'free_shipping_threshold',
    value: '50000',
    description: 'Minimum order amount for free shipping in XAF',
    category: 'shipping',
  },
];

const seedPaymentMethods = async () => {
  try {
    for (const paymentMethod of defaultPaymentMethods) {
      const exists = await PaymentMethod.findOne({ code: paymentMethod.code });
      if (!exists) {
        await PaymentMethod.create(paymentMethod);
        logger.info(`Created payment method: ${paymentMethod.name}`);
      }
    }
  } catch (error) {
    logger.error('Error seeding payment methods:', error);
  }
};

const seedSettings = async () => {
  try {
    for (const setting of defaultSettings) {
      const exists = await Settings.findOne({ key: setting.key });
      if (!exists) {
        await Settings.create(setting);
        logger.info(`Created setting: ${setting.key}`);
      }
    }
  } catch (error) {
    logger.error('Error seeding settings:', error);
  }
};

const seedAll = async () => {
  try {
    logger.info('Starting database seeding...');
    
    await seedPaymentMethods();
    await seedSettings();
    
    logger.info('Database seeding completed successfully!');
  } catch (error) {
    logger.error('Error during database seeding:', error);
  }
};

module.exports = {
  seedAll,
  seedPaymentMethods,
  seedSettings,
}; 