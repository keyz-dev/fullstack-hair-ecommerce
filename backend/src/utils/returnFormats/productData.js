const { formatImageUrl } = require('../imageUtils.js');

/**
 * Formats a product object for API response, including formatted image URLs.
 * @param {Object} product - The product document (Mongoose or plain object)
 * @returns {Object} - Formatted product data
 */
const formatProductData = (prod) => {
  return {
    _id: prod._id,
    name: prod.name,
    description: prod.description,
    price: prod.price,
    currency: prod.currency || 'XAF',
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