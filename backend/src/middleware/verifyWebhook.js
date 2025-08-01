const jwt = require("jsonwebtoken");

/**
 * Middleware to verify CamPay webhook signatures
 * This runs before your webhook handler and automatically rejects invalid requests
 */
const verifyCamPayWebhook = (req, res, next) => {
  console.log("🔐 Verifying webhook signature...");

  const { signature } = req.body;

  const CAMPAY_WEBHOOK_KEY = process.env.CAMPAY_WEBHOOK_KEY;

  if (!CAMPAY_WEBHOOK_KEY) {
    console.error("❌ CAMPAY_WEBHOOK_KEY not found in environment variables");
    process.exit(1);
  }

  // Check if signature exists
  if (!signature) {
    console.error("❌ No signature provided in webhook");
    return res.status(401).json({
      error: "Unauthorized",
      message: "Missing signature in webhook payload",
    });
  }

  try {
    // Verify and decode the JWT token
    const decoded = jwt.verify(signature, CAMPAY_WEBHOOK_KEY);

    console.log("✅ Webhook signature verified successfully");
    console.log("🔍 Decoded token payload:", decoded);

    // Attach decoded data to request for use in handler
    req.campayVerified = {
      isValid: true,
      decodedSignature: decoded,
      verifiedAt: new Date(),
    };

    // Continue to next middleware/handler
    next();
  } catch (error) {
    console.error("❌ Webhook signature verification failed:", error.message);

    // Log the specific error type for debugging
    if (error.name === "TokenExpiredError") {
      console.error("Token has expired");
    } else if (error.name === "JsonWebTokenError") {
      console.error("Invalid token format or signature");
    } else if (error.name === "NotBeforeError") {
      console.error("Token not active yet");
    }

    return res.status(401).json({
      error: "Unauthorized",
      message: "Invalid webhook signature",
      details: error.message,
    });
  }
};

module.exports = { verifyCamPayWebhook };
