const { formatImageUrl } = require('../imageUtils.js');
const Currency = require('../../models/currency.js');

/**
 * Formats a product object for API response, including formatted image URLs.
 * @param {Object} product - The product document (Mongoose or plain object)
 * @returns {Object} - Formatted product data
 */
const formatProductData = async (prod) => {
  // Get currency information
  let currencyInfo = { code: prod.currency || 'XAF', symbol: prod.currency || 'XAF', position: 'before' };
  try {
    const currency = await Currency.findOne({ code: prod.currency, isActive: true });
    if (currency) {
      currencyInfo = {
        code: currency.code,
        symbol: currency.symbol,
        position: currency.position
      };
    }
  } catch (error) {
    console.error('Error fetching currency info:', error);
  }

  return {
    _id: prod._id,
    name: prod.name,
    description: prod.description,
    price: prod.price,
    currency: currencyInfo,
    category: prod.category,
    stock: prod.stock,
    service: prod.service,
    isActive: prod.isActive,
    createdAt: prod.createdAt,
    updatedAt: prod.updatedAt,
    images: Array.isArray(prod.images) && prod.images.length > 0
      ? prod.images.map(img => formatImageUrl(img))
      : [],
  };
}

module.exports = {
  formatProductData,
};