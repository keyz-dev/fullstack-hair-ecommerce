const { formatImageUrl } = require("../imageUtils");

const formatPaymentMethodData = (paymentMethod) => {

  // Convert to plain object if it's a Mongoose document
  let doc = paymentMethod;
  if (typeof paymentMethod.toObject === "function") {
    doc = paymentMethod.toObject();
  }

  return {
    _id: doc._id,
    name: doc.name,
    code: doc.code,
    description: doc.description,
    icon: doc.icon ? formatImageUrl(doc.icon) : null,
    isActive: doc.isActive,
    isOnline: doc.isOnline,
    requiresSetup: doc.requiresSetup,
    supportedCurrencies: doc.supportedCurrencies,
    fees: doc.fees,
    minAmount: doc.minAmount,
    maxAmount: doc.maxAmount,
    sortOrder: doc.sortOrder,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
};

module.exports = { formatPaymentMethodData };