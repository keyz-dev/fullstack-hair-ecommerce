const { formatImageUrl } = require("../imageUtils");

const formatPaymentMethodData = (paymentMethod) => {

  // Convert to plain object if it's a Mongoose document
  let doc = paymentMethod;
  if (typeof paymentMethod.toObject === "function") {
    doc = paymentMethod.toObject();
  }

  // Get the appropriate configuration based on payment type
  let paymentConfig = null;
  if (doc.config) {
    switch (doc.type) {
      case 'MOBILE_MONEY':
        paymentConfig = doc.config.mobileMoney;
        break;
      case 'BANK_TRANSFER':
        paymentConfig = doc.config.bankTransfer;
        break;
      case 'CARD_PAYMENT':
        paymentConfig = doc.config.cardPayment;
        break;
      case 'PAYPAL':
        paymentConfig = doc.config.paypal;
        break;
      case 'CRYPTO':
        paymentConfig = doc.config.crypto;
        break;
    }
  }

  return {
    _id: doc._id,
    name: doc.name,
    code: doc.code,
    description: doc.description,
    type: doc.type,
    icon: doc.icon ? formatImageUrl(doc.icon) : null,
    isActive: doc.isActive,
    isOnline: doc.isOnline,
    requiresSetup: doc.requiresSetup,
    supportedCurrencies: doc.supportedCurrencies,
    fees: doc.fees,
    minAmount: doc.minAmount,
    maxAmount: doc.maxAmount,
    sortOrder: doc.sortOrder,
    config: paymentConfig,
    metadata: doc.metadata ? Object.fromEntries(doc.metadata) : {},
    customerFields: doc.customerFields || [],
    isConfigured: paymentMethod.isConfigured ? paymentMethod.isConfigured() : false,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
};

module.exports = { formatPaymentMethodData };