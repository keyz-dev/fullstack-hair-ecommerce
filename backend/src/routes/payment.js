
const express = require('express');
const paymentController = require('../controller/payment');
const { verifyCamPayWebhook } = require('../middleware/verifyWebhook');

const router = express.Router();

// Initiate payment
router.post('/initiate', paymentController.initiatePayment);

// Campay webhook (no auth needed)
router.post('/webhook', verifyCamPayWebhook, paymentController.handleWebhook);

// Check payment status
router.get('/status/:orderId', paymentController.checkPaymentStatus);

// Get payment status from active tracking
router.get('/tracking/:reference', paymentController.getPaymentStatus);

// Debug endpoint - see active connections
router.get('/debug/connections', paymentController.getDebugInfo);

// Success and cancel URLs (for Campay redirects)
router.get('/success', (req, res) => {
  res.redirect('/order-confirmation?status=success');
});

router.get('/cancel', (req, res) => {
  res.redirect('/checkout?status=cancelled');
});

module.exports = router;
