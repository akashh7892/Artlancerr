const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || 'smtp-relay.brevo.com',
  port: Number(process.env.MAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

const from = process.env.MAIL_FROM_NAME
  ? `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM}>`
  : process.env.MAIL_FROM;

/**
 * Send OTP email for password reset
 * @param {string} to - Recipient email
 * @param {string} otp - 6-digit OTP
 */
async function sendOTPEmail(to, otp) {
  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="color: #1a1d24;">Password reset</h2>
      <p>Your verification code is:</p>
      <p style="font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #c9a961;">${otp}</p>
      <p style="color: #666;">This code expires in 10 minutes. If you didn't request this, you can ignore this email.</p>
      <p style="color: #666; font-size: 12px;">— Artlancerr</p>
    </div>
  `;
  return transporter.sendMail({
    from,
    to,
    subject: 'Your password reset code - Artlancerr',
    html,
  });
}

/**
 * Send a generic notification email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - HTML body
 */
async function sendNotificationEmail(to, subject, html) {
  return transporter.sendMail({
    from,
    to,
    subject,
    html,
  });
}

module.exports = {
  transporter,
  sendOTPEmail,
  sendNotificationEmail,
};
