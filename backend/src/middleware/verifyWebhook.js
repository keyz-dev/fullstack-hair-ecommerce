const jwt = require("jsonwebtoken");
const logger = require('../utils/logger');

/**
 * Middleware to verify CamPay webhook signatures
 * This runs before your webhook handler and automatically rejects invalid requests
 */
const verifyCamPayWebhook = (req, res, next) => {
    logger.info("🔐 Verifying webhook signature...");

  const { signature } = req.body;

  if (!signature) {
        logger.error("❌ No signature provided in webhook");
    return res.status(401).json({
      error: "Unauthorized",
      message: "Missing signature in webhook payload",
    });
  }

  const CAMPAY_WEBHOOK_KEY = process.env.CAMPAY_WEBHOOK_KEY;

  if (!CAMPAY_WEBHOOK_KEY) {
        logger.error("❌ CAMPAY_WEBHOOK_KEY not found in environment variables");
    process.exit(1);
  }

  // Check if signature exists
  if (!signature) {
        logger.error("❌ No signature provided in webhook");
    return res.status(401).json({
      error: "Unauthorized",
      message: "Missing signature in webhook payload",
    });
  }

  try {
    // Verify and decode the JWT token
    const decoded = jwt.verify(signature, CAMPAY_WEBHOOK_KEY);

        logger.info("✅ Webhook signature verified successfully");
        logger.info("🔍 Decoded token payload: %o", decoded);

    // Attach decoded data to request for use in handler
    req.campayVerified = {
      isValid: true,
      decodedSignature: decoded,
      verifiedAt: new Date(),
    };

    // Continue to next middleware/handler
    next();
  } catch (error) {
        logger.error("❌ Webhook signature verification failed: %s", error.message);

    // Log the specific error type for debugging
    if (error.name === "TokenExpiredError") {
            logger.error("Token has expired");
    } else if (error.name === "JsonWebTokenError") {
            logger.error("Invalid token format or signature");
    } else if (error.name === "NotBeforeError") {
            logger.error("Token not active yet");
    }

    return res.status(401).json({
      error: "Unauthorized",
      message: "Invalid webhook signature",
      details: error.message,
    });
  }
};

module.exports = { verifyCamPayWebhook };
