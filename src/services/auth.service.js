import User from '../models/User.model.js';
import { AppError } from '../utils/AppError.js';
import { generateTokens, verifyRefreshToken, generateEmailToken, verifyEmailToken } from '../utils/jwt.js';
import * as emailService from './email.service.js';
import { googleClient } from '../config/googleOAuth.js';

export const signup = async (data) => {
  const { email, password, role, name } = data;

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new AppError('Email already registered', 400);

  // Validate role
  if (role && !['client', 'pm', 'developer'].includes(role)) {
    throw new AppError('Invalid role. Must be client, pm, or developer', 400);
  }

  const user = await User.create({
    email,
    password,
    role: role || 'client',
    name,
    isEmailVerified: false,
  });

  const verificationToken = generateEmailToken(user._id, 'email-verification');
  await emailService.sendVerificationEmail(user.email, verificationToken, name);

  return { 
    message: 'Signup successful. Please check your email to verify your account.',
    userId: user._id,
  };
};

export const login = async (email, password, platform = 'web') => {
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid credentials', 401);
  }

  if (!user.isEmailVerified) {
    throw new AppError('Please verify your email first', 403);
  }

  const { accessToken, refreshToken } = generateTokens(user, platform);
  
  user.sessions.push({ refreshToken, platform });
  if (user.sessions.length > 5) {
    user.sessions = user.sessions.slice(-5);
  }
  await user.save();

  return { 
    accessToken, 
    refreshToken, 
    user: sanitizeUser(user),
  };
};

export const googleAuth = async (token, role, platform = 'web') => {
  const ticket = await googleClient.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const { email, sub: googleId, given_name, family_name, picture } = ticket.getPayload();

  let user = await User.findOne({ $or: [{ email }, { googleId }] });
  let isNewUser = false;

  if (!user) {
    // Validate role
    if (role && !['client', 'pm', 'developer'].includes(role)) {
      throw new AppError('Invalid role. Must be client, pm, or developer', 400);
    }

    const userName = given_name 
      ? `${given_name}${family_name ? ' ' + family_name : ''}`
      : 'User';

    user = await User.create({
      email,
      googleId,
      role: role || 'client',
      isEmailVerified: true,
      name: userName,
      avatar: picture,
    });

    isNewUser = true;
    await emailService.sendWelcomeEmail(user.email, user.name);
  }

  if (!user.googleId) {
    user.googleId = googleId;
    user.isEmailVerified = true;
    await user.save();
  }

  const { accessToken, refreshToken } = generateTokens(user, platform);
  
  user.sessions.push({ refreshToken, platform });
  if (user.sessions.length > 5) {
    user.sessions = user.sessions.slice(-5);
  }
  await user.save();

  return { 
    accessToken, 
    refreshToken, 
    user: sanitizeUser(user),
  };
};

export const refreshToken = async (token) => {
  const payload = verifyRefreshToken(token);
  const user = await User.findById(payload.id);

  if (!user) throw new AppError('User not found', 404);

  const sessionIndex = user.sessions.findIndex(s => s.refreshToken === token);
  if (sessionIndex === -1) {
    throw new AppError('Invalid refresh token', 401);
  }

  user.sessions.splice(sessionIndex, 1);

  const { accessToken, refreshToken: newRefreshToken } = generateTokens(user, payload.platform);
  
  user.sessions.push({ 
    refreshToken: newRefreshToken, 
    platform: payload.platform,
  });
  await user.save();

  return { accessToken, refreshToken: newRefreshToken };
};

export const logout = async (token) => {
  try {
    const payload = verifyRefreshToken(token);
    const user = await User.findById(payload.id);
    
    if (user) {
      user.sessions = user.sessions.filter(s => s.refreshToken !== token);
      await user.save();
    }
  } catch (error) {
    return;
  }
};

export const verifyEmail = async (token) => {
  const { userId, type } = verifyEmailToken(token);
  
  if (type !== 'email-verification') {
    throw new AppError('Invalid token type', 400);
  }

  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', 404);

  if (user.isEmailVerified) {
    // Email already verified - return success instead of error
    return { alreadyVerified: true };
  }

  user.isEmailVerified = true;
  await user.save();

  await emailService.sendWelcomeEmail(user.email, user.name);
  
  return { alreadyVerified: false };
};

export const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new AppError('No user found with this email', 404);

  if (user.googleId && !user.password) {
    throw new AppError('Google accounts cannot reset password. Please login with Google.', 400);
  }

  const resetToken = generateEmailToken(user._id, 'password-reset');
  await emailService.sendPasswordResetEmail(email, resetToken, user.name);
};

export const resetPassword = async (token, newPassword) => {
  const { userId, type } = verifyEmailToken(token);
  
  if (type !== 'password-reset') {
    throw new AppError('Invalid token type', 400);
  }

  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', 404);

  user.password = newPassword;
  user.sessions = [];
  await user.save();
};

export const resendVerificationEmail = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new AppError('No user found with this email', 404);

  if (user.isEmailVerified) {
    throw new AppError('Email is already verified', 400);
  }

  const verificationToken = generateEmailToken(user._id, 'email-verification');
  await emailService.sendVerificationEmail(user.email, verificationToken, user.name);
};

const sanitizeUser = (user) => {
  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.sessions;
  delete userObj.__v;
  return userObj;
};
