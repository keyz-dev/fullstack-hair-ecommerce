// import
const express = require("express");
const {
  upload,
  handleCloudinaryUpload,
  formatFilePaths,
  handleUploadError,
} = require("../middleware/multer");
const {
  hairValidationUpload,
  cleanupTempFiles,
} = require("../middleware/hairValidationMulter");
const { authenticateUser, authorizeRoles } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const {
  productCreateSchema,
  productUpdateSchema,
} = require("../schema/productSchema");
const productController = require("../controller/product");
const {
  validateSingleImage,
  validateMultipleImages,
  testEnvironment,
} = require("../controller/hairController");

const router = express.Router();

// Get All Products
router.get("/", productController.getAllProducts);

// Validate Single Image
router.post(
  "/validate-single-image",
  authenticateUser,
  authorizeRoles(["admin", "staff"]),
  hairValidationUpload.single("image"),
  cleanupTempFiles,
  validateSingleImage
);

// Validate Multiple Images
router.post(
  "/validate-multiple-images",
  authenticateUser,
  authorizeRoles(["admin", "staff"]),
  hairValidationUpload.array("images", 10),
  cleanupTempFiles,
  validateMultipleImages
);

// Create Product
router.post(
  "/",
  authenticateUser,
  authorizeRoles(["admin", "staff"]),
  upload.array("productImages", 10),
  handleCloudinaryUpload,
  formatFilePaths,
  handleUploadError,
  validate(productCreateSchema),
  productController.createProduct
);

// Get Product Stats
router.get(
  "/stats",
  authenticateUser,
  authorizeRoles(["admin", "staff"]),
  productController.getProductStats
);

// Get Single Product
router.get("/:id", productController.getSingleProduct);

// Update product
router.put(
  "/:id",
  authenticateUser,
  authorizeRoles(["admin", "staff"]),
  upload.array("productImages", 10),
  handleCloudinaryUpload,
  formatFilePaths,
  validate(productUpdateSchema),
  productController.updateProduct
);

// Delete Product
router.delete(
  "/:id",
  authenticateUser,
  authorizeRoles(["admin", "staff"]),
  productController.deleteProduct
);

// Test hair validation environment (no auth required for debugging)
router.get("/test-hair-validation-debug", testEnvironment);

// Test hair validation environment
router.get(
  "/test-hair-validation",
  authenticateUser,
  authorizeRoles(["admin", "staff"]),
  testEnvironment
);

module.exports = router;
