const express = require('express');
const { authenticateUser, authorizeRoles } = require('../middleware/auth');
const settingsController = require('../controller/settings');

const router = express.Router();

// Get all settings (admin) or public (non-admin)
router.get('/', authenticateUser, settingsController.getSettings);

// Update settings (admin only)
router.put('/', authenticateUser, authorizeRoles(['admin']), settingsController.updateSettings);

module.exports = router; 