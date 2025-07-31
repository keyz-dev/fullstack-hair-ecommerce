const Joi = require('joi');

// Configuration schemas for different payment types
const mobileMoneyConfigSchema = Joi.object({
  phoneNumber: Joi.string().required().trim(),
  accountName: Joi.string().required().trim(),
  provider: Joi.string().valid('MTN', 'ORANGE', 'OTHER').required(),
  isVerified: Joi.boolean().optional(),
});

const bankTransferConfigSchema = Joi.object({
  accountNumber: Joi.string().required().trim(),
  accountName: Joi.string().required().trim(),
  bankName: Joi.string().required().trim(),
  swiftCode: Joi.string().trim().optional(),
  routingNumber: Joi.string().trim().optional(),
  isVerified: Joi.boolean().optional(),
});

const cardPaymentConfigSchema = Joi.object({
  merchantId: Joi.string().trim().optional(),
  apiKey: Joi.string().trim().optional(),
  webhookUrl: Joi.string().uri().optional(),
  isLive: Joi.boolean().optional(),
});

const paypalConfigSchema = Joi.object({
  clientId: Joi.string().required().trim(),
  clientSecret: Joi.string().required().trim(),
  mode: Joi.string().valid('sandbox', 'live').optional(),
  webhookId: Joi.string().trim().optional(),
});

const cryptoConfigSchema = Joi.object({
  walletAddress: Joi.string().required().trim(),
  network: Joi.string().required().trim(),
  isVerified: Joi.boolean().optional(),
});

const customerFieldSchema = Joi.object({
  name: Joi.string().required(),
  label: Joi.string().required(),
  type: Joi.string().valid('text', 'email', 'phone', 'number', 'select').optional(),
  required: Joi.boolean().optional(),
  placeholder: Joi.string().allow('', null).optional(),
  options: Joi.array().items(Joi.string()).optional(),
  validation: Joi.object({
    pattern: Joi.string().optional(),
    minLength: Joi.number().optional(),
    maxLength: Joi.number().optional(),
  }).optional(),
});

const paymentMethodCreateSchema = Joi.object({
  name: Joi.string().required().trim(),
  code: Joi.string().required().uppercase().trim(),
  description: Joi.string().trim().optional(),
  icon: Joi.string().trim().optional().allow(null, ''),
  type: Joi.string().valid('MOBILE_MONEY', 'BANK_TRANSFER', 'CARD_PAYMENT', 'PAYPAL', 'CRYPTO', 'CASH_ON_DELIVERY', 'OTHER').required(),
  isActive: Joi.boolean().optional(),
  isOnline: Joi.boolean().optional(),
  requiresSetup: Joi.boolean().optional(),
  supportedCurrencies: Joi.array().items(Joi.string().uppercase()).optional(),
  fees: Joi.number().min(0).optional(),
  minAmount: Joi.number().min(0).optional(),
  maxAmount: Joi.number().min(0).optional().allow(null),
  sortOrder: Joi.number().integer().optional(),
  config: Joi.object({
    mobileMoney: mobileMoneyConfigSchema.optional(),
    bankTransfer: bankTransferConfigSchema.optional(),
    cardPayment: cardPaymentConfigSchema.optional(),
    paypal: paypalConfigSchema.optional(),
    crypto: cryptoConfigSchema.optional(),
  }).optional(),
  metadata: Joi.object().optional(),
  customerFields: Joi.array().items(customerFieldSchema).optional(),
});

const paymentMethodUpdateSchema = Joi.object({
  name: Joi.string().trim().optional(),
  code: Joi.string().uppercase().trim().optional(),
  description: Joi.string().trim().optional(),
  icon: Joi.string().trim().optional().allow(null, ''),
  type: Joi.string().valid('MOBILE_MONEY', 'BANK_TRANSFER', 'CARD_PAYMENT', 'PAYPAL', 'CRYPTO', 'CASH_ON_DELIVERY', 'OTHER').optional(),
  isActive: Joi.boolean().optional(),
  isOnline: Joi.boolean().optional(),
  requiresSetup: Joi.boolean().optional(),
  supportedCurrencies: Joi.array().items(Joi.string().uppercase()).optional(),
  fees: Joi.number().min(0).optional(),
  minAmount: Joi.number().min(0).optional(),
  maxAmount: Joi.number().min(0).optional().allow(null),
  sortOrder: Joi.number().integer().optional(),
  config: Joi.object({
    mobileMoney: mobileMoneyConfigSchema.optional(),
    bankTransfer: bankTransferConfigSchema.optional(),
    cardPayment: cardPaymentConfigSchema.optional(),
    paypal: paypalConfigSchema.optional(),
    crypto: cryptoConfigSchema.optional(),
  }).optional(),
  metadata: Joi.object().optional(),
  customerFields: Joi.array().items(customerFieldSchema).optional(),
});

// Schema for updating payment method configuration
const paymentMethodConfigUpdateSchema = Joi.object({
  config: Joi.object({
    mobileMoney: mobileMoneyConfigSchema.optional(),
    bankTransfer: bankTransferConfigSchema.optional(),
    cardPayment: cardPaymentConfigSchema.optional(),
    paypal: paypalConfigSchema.optional(),
    crypto: cryptoConfigSchema.optional(),
  }).required(),
});

module.exports = {
  paymentMethodCreateSchema,
  paymentMethodUpdateSchema,
  paymentMethodConfigUpdateSchema,
}; 