import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import { 
  validateSignup, 
  validateLogin, 
  validateGoogleAuth,
  validateRefreshToken,
  validateEmail,
  validateResetPassword,
} from '../middleware/validators.js';

const router = express.Router();

router.post('/signup', validateSignup, authController.signup);
router.post('/login', validateLogin, authController.login);
router.post('/google', validateGoogleAuth, authController.googleAuth);
router.post('/refresh-token', validateRefreshToken, authController.refreshToken);
router.post('/logout', validateRefreshToken, authController.logout);
router.get('/verify-email/:token', authController.verifyEmail);
router.post('/resend-verification', validateEmail, authController.resendVerificationEmail);
router.post('/forgot-password', validateEmail, authController.forgotPassword);
router.post('/reset-password/:token', validateResetPassword, authController.resetPassword);

export default router;
