import { transporter } from '../config/email.js';
import { 
  verificationEmailTemplate, 
  passwordResetTemplate,
  welcomeEmailTemplate,
} from '../templates/email/index.js';

const sendEmail = async (to, subject, html) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });
};

export { sendEmail };

export const sendVerificationEmail = async (email, token, name) => {
  const url = `${process.env.CLIENT_WEB_URL}/verify-email/${token}`;
  const html = verificationEmailTemplate(url, name);
  await sendEmail(email, 'Verify Your Email - DevQuest', html);
};

export const sendPasswordResetEmail = async (email, token, name) => {
  const url = `${process.env.CLIENT_WEB_URL}/reset-password/${token}`;
  const html = passwordResetTemplate(url, name);
  await sendEmail(email, 'Reset Your Password - DevQuest', html);
};

export const sendWelcomeEmail = async (email, name) => {
  const html = welcomeEmailTemplate(name);
  await sendEmail(email, 'Welcome to DevQuest!', html);
};
