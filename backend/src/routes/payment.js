
const express = require('express');
const { authenticateUser } = require('../middleware/auth');
const paymentController = require('../controller/payment');

const router = express.Router();

// Initiate payment
router.post('/initiate', authenticateUser, paymentController.initiatePayment);

// Campay webhook (no auth needed)
router.post('/webhook', paymentController.handleWebhook);

module.exports = router;
