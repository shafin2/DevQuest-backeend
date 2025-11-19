import { verifyAccessToken } from '../utils/jwt.js';
import { AppError } from '../utils/AppError.js';
import User from '../models/User.model.js';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new AppError('Authentication required', 401);

    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.id);
    
    if (!user) throw new AppError('User not found', 401);
    
    req.user = user;
    req.platform = payload.platform || req.headers['x-platform'] || 'web';
    next();
  } catch (error) {
    next(error);
  }
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('Access denied', 403));
    }
    next();
  };
};

export const restrictPlatform = (...platforms) => {
  return (req, res, next) => {
    const userPlatform = req.headers['x-platform'] || 'web';
    if (!platforms.includes(userPlatform)) {
      return next(new AppError(`Access restricted to ${platforms.join(' or ')} only`, 403));
    }
    next();
  };
};
