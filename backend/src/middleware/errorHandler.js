const logger = require('../utils/logger');
const Joi = require('joi');
const mongoose = require('mongoose');
const multer = require('multer');
const {AppError} = require('../utils/errors');

// Utility to extract error message
function extractErrorMessage(err) {
  if (err.errors && Array.isArray(err.errors)) {
    return err.errors[0].message;
  }
  if (err.details && Array.isArray(err.details)) {
    return err.details[0].message;
  }
  return err.message || 'Internal Server Error';
}

const errorHandler = (err, req, res, next) => {
  logger.error(err.message);

  // AppError (custom)
  if (err instanceof AppError) {
    return res.status(err.statusCode || 400).json({
      status: false,
      error: err.name || 'AppError',
      message: err.message,
    });
  }

  // Joi validation errors
  if (err instanceof Joi.ValidationError) {
    return res.status(400).json({
      status: false,
      error: 'Validation error',
      message: extractErrorMessage(err),
    });
  }

  // Multer file upload errors
  if (err instanceof multer.MulterError) {
    let message = err.message;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = `${err.message.toLowerCase()}, max file size is 8Mb`;
    }
    return res.status(400).json({
      status: false,
      error: 'File Upload Error',
      message,
      field: err.field,
    });
  }

  // Mongoose validation errors
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      status: false,
      error: 'Validation Error',
      message: extractErrorMessage(err),
    });
  }

  // Mongoose cast errors (e.g., invalid ObjectId)
  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      status: false,
      error: 'Invalid ID',
      message: `Invalid ${err.path}: ${err.value}`,
    });
  }

  // Other Mongoose errors
  if (err instanceof mongoose.Error) {
    return res.status(500).json({
      status: false,
      error: 'Mongoose Error',
      message: err.message,
    });
  }

  // Fallback for unknown errors
  return res.status(err.status || 500).json({
    status: false,
    error: err.name || 'Unknown error',
    message: extractErrorMessage(err),
  });
};

module.exports = errorHandler;