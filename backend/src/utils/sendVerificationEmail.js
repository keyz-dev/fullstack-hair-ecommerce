const emailService = require('../services/emailService');
const crypto = require('crypto');
const logger = require('./logger');

/**
 * Generates a verification code, updates the user, and sends a verification email.
 * @param {object} user - The user mongoose document
 * @param {string} email - The user's email address
 * @param {string} name - The user's name (for email template)
 * @returns {Promise<void>}
 */
async function sendVerificationEmail(user, email, name, template='emailVerification') {
  // Generate verification code
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  await user.updateOne({
    emailVerificationCode: verificationCode,
    emailVerificationCodeExpiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 mins
  });
  // Send verification email
  try {
    await emailService.sendEmail({
      to: email,
      subject: 'Verify your email',
      template,
      data: {
        name,
        verificationCode,
      },
    });
  } catch (err) {
        logger.error('Error sending verification email:', err);
    throw new Error('Failed to send verification email. Please try again later.');
  }
}

async function sendPasswordResetEmail(user, email, name) {
  // Generate a secure random token
  const passwordResetToken = crypto.randomBytes(32).toString('hex');
  await user.update({
    passwordResetToken,
    passwordResetTokenExpiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 mins
  });
  await sendEmail({
    to: email,
    subject: 'Reset your password',
    template: 'passwordReset',
    data: {
      name,
      passwordResetToken,
    },
  });
}

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
}; 