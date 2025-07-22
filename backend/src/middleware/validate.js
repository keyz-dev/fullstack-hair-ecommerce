const Joi = require('joi');
const User = require('../models/user');
const { NotFoundError, BadRequestError } = require('../utils/errors');

function validate(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      error.status = 400;
      return next(error);
    }
    next();
  };
}

async function validatePasswordResetToken(req, res, next) {
  const { token } = req.query;
  if (!token) return next(new BadRequestError('Missing password reset token.'));
  const user = await User.findOne({ passwordResetToken: token, passwordResetTokenExpiresAt: { $gt: Date.now() } });
  if (!user) return next(new NotFoundError('Invalid or expired password reset token.'));
  req.resetUser = user;
  next();
}

module.exports = {
  validate,
  validatePasswordResetToken,
}; 