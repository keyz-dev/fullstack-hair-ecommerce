const express = require('express');
const { authenticateUser } = require('../middleware/auth');
const analyticsController = require('../controller/analytics');

const router = express.Router();

// All analytics routes require authentication
router.use(authenticateUser);

// Client analytics endpoints
router.get('/client', analyticsController.getClientAnalytics);
router.get('/orders', analyticsController.getOrderAnalytics);
router.get('/bookings', analyticsController.getBookingAnalytics);
router.get('/spending', analyticsController.getSpendingAnalytics);
router.get('/activity', analyticsController.getActivityTimeline);

module.exports = router; 