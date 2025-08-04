const { formatImageUrl } = require('../imageUtils.js');
const { getCurrencyInfo } = require('../currencyUtils.js');

/**
 * Formats a product object for API response, including formatted image URLs.
 * @param {Object} product - The product document (Mongoose or plain object)
 * @returns {Object} - Formatted product data
 */
const formatProductData = async (prod) => {
  return {
    _id: prod._id,
    name: prod.name,
    description: prod.description,
    price: prod.price,
    discount: prod.discount,
    currency: prod.currency || 'XAF', // Return as string code
    images: prod.images ? prod.images.map(img => formatImageUrl(img)) : [],
    category: prod.category,
    stock: prod.stock,
    rating: prod.rating,
    reviewCount: prod.reviewCount,
    variants: prod.variants || [],
    specifications: prod.specifications || {},
    features: prod.features || [],
    tags: prod.tags || [],
    metaTitle: prod.metaTitle,
    metaDescription: prod.metaDescription,
    slug: prod.slug,
    isActive: prod.isActive,
    isFeatured: prod.isFeatured,
    isOnSale: prod.isOnSale,
    createdAt: prod.createdAt,
    updatedAt: prod.updatedAt
  };
};

module.exports = { formatProductData };