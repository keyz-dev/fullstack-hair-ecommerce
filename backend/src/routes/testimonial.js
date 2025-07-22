const express = require('express');
const { authenticateUser, authorizeRoles } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { testimonialCreateSchema } = require('../schema/testimonialSchema');
const testimonialController = require('../controller/testimonial');

const router = express.Router();

router.get('/', testimonialController.getAllTestimonials);
router.post('/', authenticateUser, validate(testimonialCreateSchema), testimonialController.createTestimonial);
router.put('/:id', authenticateUser, authorizeRoles(['admin']), testimonialController.updateTestimonial);
router.delete('/:id', authenticateUser, authorizeRoles(['admin']), testimonialController.deleteTestimonial);

module.exports = router; 