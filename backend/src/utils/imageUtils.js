const Joi = require("joi");
require("dotenv").config();

const isLocalImageUrl = (url) => {
  return url.startsWith("/uploads/");
};

const isCloudinaryUrl = (url) => {
  // Check if it's a Cloudinary URL (production)
  return url.includes("cloudinary.com");
};

const validateImageUrl = (url, helpers) => {
  if (process.env.NODE_ENV === "production") {
    if (!isCloudinaryUrl(url)) {
      return helpers.error("any.invalid", {
        message: "Image must be uploaded to Cloudinary in production",
      });
    }
  } else {
    if (!isLocalImageUrl(url)) {
      return helpers.error("any.invalid", {
        message: "Image must be uploaded to local storage in development",
      });
    }
  }
  return url;
};

// Helper function to format image URLs
const formatImageUrl = (image) => {
  if (!image) return null;
  if (isLocalImageUrl(image)) {
    return `${process.env.SERVER_URL}${image}`;
  }
  return image;
};

// Joi extension for image validation
const imageUrlSchema = Joi.string().custom(validateImageUrl);

// Schema for single image
const singleImageSchema = imageUrlSchema.allow(null, "").optional();

// Schema for array of images
const imageArraySchema = Joi.array().items(imageUrlSchema).allow(null);

module.exports = {
  isLocalImageUrl,
  isCloudinaryUrl,
  validateImageUrl,
  singleImageSchema,
  imageArraySchema,
  formatImageUrl,
};
