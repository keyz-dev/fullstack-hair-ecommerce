// utils/formatUserData.js

const { formatImageUrl } = require("../imageUtils.js");

/**
 * Formats a Mongoose user document into a clean object for API responses.
 * @param {object} user - The Mongoose user document.
 * @returns {object} A clean object with only the allowed fields.
 */
const formatUserData = (user) => {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    role: user.role,
    avatar: formatImageUrl(user.avatar),
    createdAt: user.createdAt,
    bookings: user.bookings,
    orders: user.orders,
    wishlist: user.wishlist,
    isActive: user.isActive,
    isVerified: user.isVerified,
    emailVerificationCode: user.emailVerificationCode,
    emailVerificationCodeExpiresAt: user.emailVerificationCodeExpiresAt,
  };
};

module.exports = formatUserData;