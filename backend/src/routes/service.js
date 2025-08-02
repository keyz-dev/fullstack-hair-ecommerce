const express = require('express');
const { upload, handleCloudinaryUpload, formatFilePaths } = require('../middleware/multer');
const { authenticateUser, authorizeRoles } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { serviceCreateSchema, serviceUpdateSchema } = require('../schema/serviceSchema');
const serviceController = require('../controller/service');

const router = express.Router();

// Public routes
router.get('/active', serviceController.getActiveServices);

// Protected routes (admin/staff only)
router.get('/', authenticateUser, authorizeRoles(['admin', 'staff']), serviceController.getAllServices);
router.get('/stats', authenticateUser, authorizeRoles(['admin', 'staff']), serviceController.getServiceStats);

router.post('/', 
  authenticateUser, 
  authorizeRoles(['admin', 'staff']), 
  upload.single('serviceImage'), 
  handleCloudinaryUpload, 
  formatFilePaths, 
  validate(serviceCreateSchema), 
  serviceController.createService
);

router.put('/:id', 
  authenticateUser, 
  authorizeRoles(['admin', 'staff']), 
  upload.single('serviceImage'), 
  handleCloudinaryUpload, 
  formatFilePaths, 
  validate(serviceUpdateSchema), 
  serviceController.updateService
);

router.delete('/:id', authenticateUser, authorizeRoles(['admin', 'staff']), serviceController.deleteService);
router.get('/:id', serviceController.getService);

// Staff management routes
router.post('/:id/assign-staff', authenticateUser, authorizeRoles(['admin', 'staff']), serviceController.assignStaff);
router.post('/:id/activate', authenticateUser, authorizeRoles(['admin', 'staff']), serviceController.activateService);
router.post('/:id/deactivate', authenticateUser, authorizeRoles(['admin', 'staff']), serviceController.deactivateService);

module.exports = router; 