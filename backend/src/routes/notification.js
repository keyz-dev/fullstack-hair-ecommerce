const express = require('express');
const { authenticateUser } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { notificationCreateSchema } = require('../schema/notificationSchema');
const notificationController = require('../controller/notification');

const router = express.Router();

router.get('/', authenticateUser, notificationController.getUserNotifications);
router.post('/', authenticateUser, validate(notificationCreateSchema), notificationController.createNotification);
router.patch('/:id/read', authenticateUser, notificationController.markAsRead);
router.delete('/:id', authenticateUser, notificationController.deleteNotification);

module.exports = router; 