const Service = require('../models/service');
const { BadRequestError, NotFoundError } = require('../utils/errors');

// Create a new service
exports.createService = async (req, res, next) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({ success: true, service });
  } catch (err) {
    next(err);
  }
};

// Get all services
exports.getAllServices = async (req, res, next) => {
  try {
    const services = await Service.find().populate('category staff');
    res.json({ success: true, services });
  } catch (err) {
    next(err);
  }
};

// Get a single service
exports.getService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id).populate('category staff');
    if (!service) return next(new NotFoundError('Service not found'));
    res.json({ success: true, service });
  } catch (err) {
    next(err);
  }
};

// Update a service
exports.updateService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!service) return next(new NotFoundError('Service not found'));
    res.json({ success: true, service });
  } catch (err) {
    next(err);
  }
};

// Delete a service
exports.deleteService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return next(new NotFoundError('Service not found'));
    res.json({ success: true, message: 'Service deleted' });
  } catch (err) {
    next(err);
  }
}; 