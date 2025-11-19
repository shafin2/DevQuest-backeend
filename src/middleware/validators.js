import { body, validationResult } from 'express-validator';
import AppError from '../utils/AppError.js';

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array()[0].msg, 400));
  }
  next();
};

export const validateSignup = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('role').optional().isIn(['client', 'developer', 'pm']).withMessage('Invalid role'),
  handleValidation,
];

export const validateLogin = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  body('platform').optional().isIn(['web', 'mobile']).withMessage('Invalid platform'),
  handleValidation,
];

export const validateGoogleAuth = [
  body('token').notEmpty().withMessage('Google token is required'),
  body('role').optional().isIn(['client', 'developer', 'pm']).withMessage('Invalid role'),
  body('platform').optional().isIn(['web', 'mobile']).withMessage('Invalid platform'),
  handleValidation,
];

export const validateRefreshToken = [
  body('refreshToken').notEmpty().withMessage('Refresh token is required'),
  handleValidation,
];

export const validateEmail = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  handleValidation,
];

export const validateResetPassword = [
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  handleValidation,
];

export const validateChangePassword = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),
  handleValidation,
];

// ===================
// PROFILE VALIDATORS
// ===================

export const validateProfileUpdate = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('bio').optional().trim(),
  body('skills').optional().isArray().withMessage('Skills must be an array'),
  body('experience').optional().trim(),
  body('portfolio').optional().trim(),
  body('github').optional().trim(),
  body('linkedin').optional().trim(),
  body('hourlyRate').optional().isFloat({ min: 0 }).withMessage('Invalid hourly rate'),
  body('availability').optional().isIn(['available', 'busy', 'unavailable', '']).withMessage('Invalid availability'),
  handleValidation,
];


