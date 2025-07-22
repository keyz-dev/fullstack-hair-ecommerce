const jwt = require('jsonwebtoken');
const { UnauthorizedError, NotFoundError } = require('../utils/errors');
const User = require('../models/user');

// Authentication middleware
const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(new UnauthorizedError('Login first to access this resource.'));
  }

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new NotFoundError('User not found.'));
    }
    req.rootUser = user;
    next();
  } catch (err) {
    return next(new UnauthorizedError('Invalid or expired token.'));
  }
};

// Role-based authorization middleware
const authorizeRoles = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.rootUser.role)) {
      return next(
        new UnauthorizedError(`Only ${roles.join(', ')} are allowed to access this resource.`)
      );
    }
    next();
  };
};

module.exports = { authenticateUser, authorizeRoles };
