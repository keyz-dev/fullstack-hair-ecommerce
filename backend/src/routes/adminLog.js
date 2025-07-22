const express = require('express');
const { authenticateUser, authorizeRoles } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { adminLogCreateSchema } = require('../schema/adminLogSchema');
const adminLogController = require('../controller/adminLog');

const router = express.Router();

router.post('/', authenticateUser, authorizeRoles(['admin']), validate(adminLogCreateSchema), adminLogController.logAction);
router.get('/', authenticateUser, authorizeRoles(['admin']), adminLogController.getAllLogs);

module.exports = router; 