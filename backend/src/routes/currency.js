const express = require('express');
const { authenticateUser, authorizeRoles } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { currencyCreateSchema, currencyUpdateSchema } = require('../schema/currencySchema');
const currencyController = require('../controller/currency');

const router = express.Router();

// Public routes (for frontend display)
router.get('/active', currencyController.getActiveCurrencies);

// Protected routes (admin only)
router.get('/', authenticateUser, authorizeRoles(['admin']), currencyController.getAllCurrencies);
router.get('/:id', authenticateUser, authorizeRoles(['admin']), currencyController.getCurrencyById);
router.post('/', authenticateUser, authorizeRoles(['admin']), validate(currencyCreateSchema), currencyController.createCurrency);
router.put('/:id', authenticateUser, authorizeRoles(['admin']), validate(currencyUpdateSchema), currencyController.updateCurrency);
router.delete('/:id', authenticateUser, authorizeRoles(['admin']), currencyController.deleteCurrency);
router.patch('/:id/set-base', authenticateUser, authorizeRoles(['admin']), currencyController.setBaseCurrency);

module.exports = router; 