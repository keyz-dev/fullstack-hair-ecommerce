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
    firstName: user.name.split(' ')[0],
    lastName: user.name.split(' ')[1],
    name: user.name, 
    email: user.email,
    phone: user.phone,
    avatar: formatImageUrl(user.avatar),
    dateOfBirth: user.dateOfBirth,
    gender: user.gender,
    bio: user.bio,
    preferences: user.preferences,
    emailVerified: user.emailVerified,
    lastLogin: user.lastLogin,
    role: user.role,
    createdAt: user.createdAt,
    bookings: user.bookings,
    orders: user.orders,
    wishlist: user.wishlist,
    isActive: user.isActive,
    isVerified: user.isVerified,
    authProvider: user.authProvider,
  };
};

module.exports = formatUserData;