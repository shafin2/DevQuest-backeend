import * as authService from '../services/auth.service.js';

export const signup = async (req, res, next) => {
  try {
    const result = await authService.signup(req.body);
    res.status(201).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password, platform } = req.body;
    const result = await authService.login(email, password, platform);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const googleAuth = async (req, res, next) => {
  try {
    const { token, role, platform } = req.body;
    const result = await authService.googleAuth(token, role, platform);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshToken(refreshToken);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    await authService.logout(refreshToken);
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const result = await authService.verifyEmail(req.params.token);
    if (result.alreadyVerified) {
      res.json({ success: true, message: 'Email was already verified. You can now login.' });
    } else {
      res.json({ success: true, message: 'Email verified successfully' });
    }
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    await authService.forgotPassword(req.body.email);
    res.json({ success: true, message: 'Password reset link sent to email' });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    await authService.resetPassword(req.params.token, req.body.password);
    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    next(error);
  }
};

export const resendVerificationEmail = async (req, res, next) => {
  try {
    await authService.resendVerificationEmail(req.body.email);
    res.json({ success: true, message: 'Verification email sent successfully' });
  } catch (error) {
    next(error);
  }
};
