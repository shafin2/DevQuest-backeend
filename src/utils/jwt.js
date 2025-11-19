import jwt from 'jsonwebtoken';
import { AppError } from './AppError.js';

export const generateTokens = (user, platform = 'web') => {
  const payload = { 
    id: user._id.toString(), 
    role: user.role,
    platform,
  };

  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: '15m',
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (error) {
    throw new AppError('Invalid or expired access token', 401);
  }
};

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    throw new AppError('Invalid or expired refresh token', 401);
  }
};

export const generateEmailToken = (userId, type) => {
  const payload = { userId, type };
  return jwt.sign(payload, process.env.JWT_EMAIL_SECRET, {
    expiresIn: type === 'email-verification' ? '24h' : '1h',
  });
};

export const verifyEmailToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_EMAIL_SECRET);
  } catch (error) {
    throw new AppError('Invalid or expired token', 400);
  }
};
