const ApiError = require('../utils/ApiError');

/**
 * Role-based Access Control Middleware
 * Factory function that returns middleware checking user role
 * @param {string[]} allowedRoles - Array of permitted roles
 */
const roleCheck = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication required.'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        ApiError.forbidden(
          `Access denied. Required role: ${allowedRoles.join(' or ')}. Your role: ${req.user.role}`
        )
      );
    }

    next();
  };
};

module.exports = roleCheck;
