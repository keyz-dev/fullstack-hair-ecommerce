const express = require('express');
const { authenticateUser, authorizeRoles } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { serviceCreateSchema, serviceUpdateSchema } = require('../schema/serviceSchema');
const serviceController = require('../controller/service');

const router = express.Router();

router.get('/', serviceController.getAllServices);
router.get('/:id', serviceController.getService);
router.post('/', authenticateUser, authorizeRoles(['admin', 'staff']), validate(serviceCreateSchema), serviceController.createService);
router.put('/:id', authenticateUser, authorizeRoles(['admin', 'staff']), validate(serviceUpdateSchema), serviceController.updateService);
router.delete('/:id', authenticateUser, authorizeRoles(['admin', 'staff']), serviceController.deleteService);

module.exports = router; 