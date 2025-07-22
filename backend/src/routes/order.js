const express = require('express');
const { authenticateUser, authorizeRoles } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { orderCreateSchema } = require('../schema/orderSchema');
const orderController = require('../controller/order');

const router = express.Router();

router.post('/', authenticateUser, validate(orderCreateSchema), orderController.newOrder);
router.get('/my', authenticateUser, orderController.getMyOrders);
router.get('/:id', authenticateUser, orderController.getSingleOrder);
router.get('/admin/all', authenticateUser, authorizeRoles(['admin']), orderController.getAdminOrders);

module.exports = router;
