const express = require('express');
const { authenticateUser, authorizeRoles } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { bookingCreateSchema } = require('../schema/bookingSchema');
const bookingController = require('../controller/booking');

const router = express.Router();

router.post('/', authenticateUser, validate(bookingCreateSchema), bookingController.createBooking);
router.get('/my', authenticateUser, bookingController.getUserBookings);
router.get('/all', authenticateUser, authorizeRoles(['admin', 'staff']), bookingController.getAllBookings);
router.patch('/:id/status', authenticateUser, authorizeRoles(['admin', 'staff']), bookingController.updateBookingStatus);
router.delete('/:id', authenticateUser, bookingController.deleteBooking);

module.exports = router; 