const express = require('express');
const { authenticateUser, authorizeRoles } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { paymentMethodCreateSchema, paymentMethodUpdateSchema } = require('../schema/paymentMethodSchema');
const paymentMethodController = require('../controller/paymentMethod');

const router = express.Router();

// Public routes (for frontend display)
router.get('/active', paymentMethodController.getActivePaymentMethods);

// Protected routes (admin only)
router.get('/', authenticateUser, authorizeRoles(['admin']), paymentMethodController.getAllPaymentMethods);
router.get('/:id', authenticateUser, authorizeRoles(['admin']), paymentMethodController.getPaymentMethodById);
router.post('/', authenticateUser, authorizeRoles(['admin']), validate(paymentMethodCreateSchema), paymentMethodController.createPaymentMethod);
router.put('/:id', authenticateUser, authorizeRoles(['admin']), validate(paymentMethodUpdateSchema), paymentMethodController.updatePaymentMethod);
router.delete('/:id', authenticateUser, authorizeRoles(['admin']), paymentMethodController.deletePaymentMethod);
router.patch('/:id/toggle', authenticateUser, authorizeRoles(['admin']), paymentMethodController.togglePaymentMethodStatus);

module.exports = router; 