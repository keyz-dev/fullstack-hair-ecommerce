const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const { BadRequestError } = require("./errors");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Checks if a string is a Cloudinary URL
 * @param {string} url - The URL to check
 * @returns {boolean} - Whether the URL is a Cloudinary URL
 */
const isCloudinaryUrl = (url) => {
  return typeof url === "string" && url.includes("cloudinary.com");
};

/**
 * Uploads a file to Cloudinary.
 * @param {Object|Buffer|string} file - The file to upload. Can be a Buffer, file object from multer, file path, or Cloudinary URL.
 * @param {Object} options - Upload options (e.g., folder, resource_type).
 * @returns {Promise<Object>} - The Cloudinary upload result.
 */
const uploadToCloudinary = async (file, options = {}) => {
  if (!file) {
    throw new BadRequestError("No file provided for upload");
  }

  // If it's already a Cloudinary URL, return it
  if (typeof file === "string" && isCloudinaryUrl(file)) {
    return { secure_url: file };
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) {
          reject(
            new BadRequestError(`Cloudinary upload failed: ${error.message}`)
          );
        } else {
          resolve(result);
        }
      }
    );

    try {
      if (Buffer.isBuffer(file)) {
        // Handle Buffer
        uploadStream.end(file);
      } else if (typeof file === "string") {
        // Handle file path string
        fs.createReadStream(file).pipe(uploadStream);
      } else if (file.buffer) {
        // Handle multer memory storage file
        uploadStream.end(file.buffer);
      } else if (file.path) {
        // Handle multer disk storage file
        fs.createReadStream(file.path).pipe(uploadStream);
      } else {
        throw new BadRequestError("Invalid file format provided");
      }
    } catch (error) {
      reject(new BadRequestError(`File processing failed: ${error.message}`));
    }
  });
};

module.exports = {
  uploadToCloudinary,
};
