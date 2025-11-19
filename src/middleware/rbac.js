import AppError from '../utils/AppError.js';

// Middleware to restrict routes to specific roles
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          `You do not have permission to perform this action. Required role: ${roles.join(' or ')}`,
          403
        )
      );
    }
    next();
  };
};

// Specific role checks
export const clientOnly = restrictTo('client');
export const pmOnly = restrictTo('pm');
export const developerOnly = restrictTo('developer');
export const pmOrClient = restrictTo('pm', 'client');
export const pmOrDeveloper = restrictTo('pm', 'developer');
