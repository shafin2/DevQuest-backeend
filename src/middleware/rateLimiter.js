import rateLimit from 'express-rate-limit';

// Disabled for testing - set to very high limit
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10000, // Very high limit for testing
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
});
