const express = require("express");
const { authenticateUser, authorizeRoles } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const {
  paymentMethodCreateSchema,
  paymentMethodUpdateSchema,
  paymentMethodConfigUpdateSchema,
} = require("../schema/paymentMethodSchema");
const paymentMethodController = require("../controller/paymentMethod");
const {
  upload,
  handleCloudinaryUpload,
  formatFilePaths,
} = require("../middleware/multer");

const router = express.Router();

// Public routes (for frontend display)
router.get("/active", paymentMethodController.getActivePaymentMethods);

// Protected routes (admin only)
router.get(
  "/",
  authenticateUser,
  authorizeRoles(["admin"]),
  paymentMethodController.getAllPaymentMethods
);
router.get(
  "/types",
  authenticateUser,
  authorizeRoles(["admin"]),
  paymentMethodController.getPaymentMethodTypes
);
router.get(
  "/:id",
  authenticateUser,
  authorizeRoles(["admin"]),
  paymentMethodController.getPaymentMethodById
);
router.post(
  "/",
  authenticateUser,
  authorizeRoles(["admin"]),
  upload.single("icon"),
  handleCloudinaryUpload,
  formatFilePaths,
  validate(paymentMethodCreateSchema),
  paymentMethodController.createPaymentMethod
);
router.put(
  "/:id",
  authenticateUser,
  authorizeRoles(["admin"]),
  upload.single("icon"),
  handleCloudinaryUpload,
  formatFilePaths,
  validate(paymentMethodUpdateSchema),
  paymentMethodController.updatePaymentMethod
);
router.put(
  "/:id/config",
  authenticateUser,
  authorizeRoles(["admin"]),
  validate(paymentMethodConfigUpdateSchema),
  paymentMethodController.updatePaymentMethodConfig
);
router.get(
  "/:id/verify",
  authenticateUser,
  authorizeRoles(["admin"]),
  paymentMethodController.verifyPaymentMethodConfig
);
router.delete(
  "/:id",
  authenticateUser,
  authorizeRoles(["admin"]),
  paymentMethodController.deletePaymentMethod
);
router.patch(
  "/:id/toggle",
  authenticateUser,
  authorizeRoles(["admin"]),
  paymentMethodController.togglePaymentMethodStatus
);

module.exports = router;
