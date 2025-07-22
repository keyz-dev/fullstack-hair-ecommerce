const Testimonial = require('../models/testimonial');
const { BadRequestError, NotFoundError } = require('../utils/errors');

// Create a testimonial
exports.createTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json({ success: true, testimonial });
  } catch (err) {
    next(err);
  }
};

// Get all testimonials (optionally filter by approval)
exports.getAllTestimonials = async (req, res, next) => {
  try {
    const filter = req.query.isApproved ? { isApproved: req.query.isApproved } : {};
    const testimonials = await Testimonial.find(filter).populate('user');
    res.json({ success: true, testimonials });
  } catch (err) {
    next(err);
  }
};

// Approve or update a testimonial
exports.updateTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!testimonial) return next(new NotFoundError('Testimonial not found'));
    res.json({ success: true, testimonial });
  } catch (err) {
    next(err);
  }
};

// Delete a testimonial
exports.deleteTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) return next(new NotFoundError('Testimonial not found'));
    res.json({ success: true, message: 'Testimonial deleted' });
  } catch (err) {
    next(err);
  }
}; 