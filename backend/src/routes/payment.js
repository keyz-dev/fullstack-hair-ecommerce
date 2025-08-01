
const express = require('express');
const { authenticateUser } = require('../middleware/auth');
const paymentController = require('../controller/payment');

const router = express.Router();

// Initiate payment
router.post('/initiate', paymentController.initiatePayment);

// Campay webhook (no auth needed)
router.post('/webhook', paymentController.handleWebhook);

// Check payment status
router.get('/status/:orderId', paymentController.checkPaymentStatus);


// Success and cancel URLs (for Campay redirects)
router.get('/success', (req, res) => {
  res.redirect('/order-confirmation?status=success');
});

router.get('/cancel', (req, res) => {
  res.redirect('/checkout?status=cancelled');
});

module.exports = router;
