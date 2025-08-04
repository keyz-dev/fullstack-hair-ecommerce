const { formatImageUrl } = require('../imageUtils.js');
const { formatProductData } = require('./productData.js');

/**
 * Formats an order item with product details including formatted image URLs.
 * @param {Object} orderItem - The order item document with populated product
 * @returns {Object} - Formatted order item data
 */
const formatOrderItem = async (orderItem) => {
  const formattedItem = {
    _id: orderItem._id,
    quantity: orderItem.quantity,
    unitPrice: orderItem.unitPrice,
    variant: orderItem.variant
  };

  // If product is populated, format it with proper image URLs
  if (orderItem.product && typeof orderItem.product === 'object') {
    formattedItem.product = await formatProductData(orderItem.product);
  } else {
    // If product is just an ID, keep it as is
    formattedItem.product = orderItem.product;
  }

  return formattedItem;
};

/**
 * Formats an order object for API response, including formatted product data.
 * @param {Object} order - The order document (Mongoose or plain object)
 * @returns {Object} - Formatted order data
 */
const formatOrderData = async (order) => {
  // Format order items with product details
  const formattedOrderItems = [];
  if (order.orderItems && Array.isArray(order.orderItems)) {
    for (const item of order.orderItems) {
      const formattedItem = await formatOrderItem(item);
      formattedOrderItems.push(formattedItem);
    }
  }

  return {
    _id: order._id,
    orderNumber: order.orderNumber,
    user: order.user,
    guestInfo: order.guestInfo,
    orderItems: formattedOrderItems,
    shippingAddress: order.shippingAddress,
    paymentMethod: order.paymentMethod,
    paymentReference: order.paymentReference,
    paymentStatus: order.paymentStatus,
    paymentTime: order.paymentTime,
    status: order.status,
    totalAmount: order.totalAmount,
    subtotal: order.subtotal,
    shipping: order.shipping,
    tax: order.tax,
    processingFee: order.processingFee,
    notes: order.notes,
    isDelivered: order.isDelivered,
    deliveredAt: order.deliveredAt,
    booking: order.booking,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt
  };
};

module.exports = { formatOrderData, formatOrderItem }; 