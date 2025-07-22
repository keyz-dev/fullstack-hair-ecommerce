const fs = require("fs").promises;
const path = require("path");
const { cloudinary } = require("./cloudinary");
const { isLocalImageUrl, isCloudinaryUrl } = require("./imageUtils");

/**
 * Delete a single image from storage
 * @param {string} imagePath - The image path or URL to delete
 * @returns {Promise<void>}
 */
const deleteImage = async (imagePath) => {
  try {
    if (isLocalImageUrl(imagePath)) {
      const filePath = path.join(
        process.cwd(),
        "src",
        imagePath.replace(/^\//, "")
      );
      await fs.unlink(filePath);
    } else if (isCloudinaryUrl(imagePath)) {
      // Extract public_id from Cloudinary URL
      const publicId = imagePath.split("/").slice(-1)[0].split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }
  } catch (error) {
    console.error(`Error deleting image ${imagePath}:`, error);
    // Don't throw the error, just log it
  }
};

/**
 * Delete multiple images from storage
 * @param {string[]} imagePaths - Array of image paths or URLs to delete
 * @returns {Promise<void>}
 */
const deleteImages = async (imagePaths) => {
  if (!Array.isArray(imagePaths)) return;
  const deletePromises = imagePaths.map((path) => deleteImage(path));
  await Promise.all(deletePromises);
};

/**
 * Extract image paths from model instance
 * @param {Object} instance - Model instance
 * @returns {string[]} Array of image paths
 */
const extractImagePaths = (instance) => {
  const paths = [];

  // Handle single image fields
  if (instance.avatar) paths.push(instance.avatar);
  if (instance.logo) paths.push(instance.logo);
  if (instance.agencyImages) paths.push(instance.agencyImages);
  if (instance.stationImages) paths.push(instance.stationImages);
  if (instance.document) paths.push(instance.document);

  // Handle array of images
  if (Array.isArray(instance.images)) {
    paths.push(...instance.images);
  }

  return paths;
};

/**
 * Clean up images before model deletion
 * @param {Object} instance - Model instance being deleted
 * @returns {Promise<void>}
 */
const cleanUpInstanceImages = async (instance) => {
  const imagePaths = extractImagePaths(instance);
  await deleteImages(imagePaths);
};

const cleanUpFileImages = async (req) => {
  if (!req.file && !req.files) return;
  let imagePaths = [];

  if (req.file) {
    imagePaths.push(req.file.path);
    await deleteImages(imagePaths);
  }

  if (req.files && Object.keys(req.files).length > 0) {
    Object.keys(req.files).forEach((key) => {
      if (Array.isArray(req.files[key])) {
        imagePaths.push(...req.files[key].map((file) => file.path));
      } else {
        imagePaths.push(req.files[key].path);
      }
    });
    await deleteImages(imagePaths);
  }

};

/**
 * Clean up old images when updating
 * @param {Object} instance - Model instance being updated
 * @param {Object} previousValues - Previous values of the instance
 * @returns {Promise<void>}
 */
const cleanupOldImages = async (instance, previousValues) => {
  const oldPaths = extractImagePaths(previousValues);
  const newPaths = extractImagePaths(instance);

  // Find images that were removed
  const removedPaths = oldPaths.filter((path) => !newPaths.includes(path));
  await deleteImages(removedPaths);
};

module.exports = {
  deleteImage,
  deleteImages,
  cleanUpFileImages,
  cleanUpInstanceImages,
  cleanupOldImages,
};
