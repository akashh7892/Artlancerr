const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: false,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

// Verify SMTP connection
transporter.verify((error, success) => {
  if (error) {
    console.log("SMTP connection error:", error);
  } else {
    console.log("SMTP server is ready to send emails");
  }
});

const from = process.env.MAIL_FROM_NAME
  ? `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM}>`
  : process.env.MAIL_FROM;

/**
 * Send OTP email
 */
async function sendOTPEmail(to, otp) {
  const html = `
  <div style="font-family:sans-serif;max-width:480px;margin:auto">
      <h2>Password Reset</h2>
      <p>Your verification code is:</p>
      <h1 style="letter-spacing:4px;color:#c9a961">${otp}</h1>
      <p>This code expires in 10 minutes.</p>
      <p style="font-size:12px;color:#666">— Flip</p>
  </div>
  `;

  return transporter.sendMail({
    from,
    to,
    subject: "Your Password Reset Code - Flip",
    html,
  });
}

/**
 * Send notification email
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
