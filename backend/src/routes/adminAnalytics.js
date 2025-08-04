const express = require('express');
const { authenticateUser, authorizeRoles } = require('../middleware/auth');
const adminAnalyticsController = require('../controller/adminAnalytics');

const router = express.Router();

// All admin analytics routes require authentication and admin role
router.use(authenticateUser);
router.use(authorizeRoles(['admin']));

// Admin analytics endpoints
router.get('/overview', adminAnalyticsController.getAdminOverview);
router.get('/sales', adminAnalyticsController.getSalesAnalytics);
router.get('/users', adminAnalyticsController.getUserAnalytics);
router.get('/products', adminAnalyticsController.getProductAnalytics);
router.get('/orders', adminAnalyticsController.getOrderAnalytics);
router.get('/bookings', adminAnalyticsController.getBookingAnalytics);
router.get('/revenue', adminAnalyticsController.getRevenueAnalytics);
router.get('/activity', adminAnalyticsController.getActivityTimeline);

module.exports = router; 