/**
 * mailer.js — Email utility using nodemailer
 *
 * Configure via environment variables:
 *   SMTP_HOST     e.g. smtp.gmail.com
 *   SMTP_PORT     e.g. 587
 *   SMTP_USER     e.g. yourapp@gmail.com
 *   SMTP_PASS     App Password (Gmail) or SMTP password
 *   EMAIL_FROM    e.g. "Fitness Planner AI <yourapp@gmail.com>"
 *
 * If SMTP_USER / SMTP_PASS are not set, the token is logged to the
 * server console only (useful during local development).
 */

const nodemailer = require('nodemailer');

function createTransporter() {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null; // no email configured
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

/**
 * Send a password-reset email.
 * Falls back to console.log if SMTP is not configured.
 */
async function sendResetEmail(toEmail, toName, resetToken) {
  const transporter = createTransporter();

  const from = process.env.EMAIL_FROM || `"Fitness Planner AI" <${process.env.SMTP_USER}>`;
  const subject = '🔑 Password Reset — Fitness Planner AI';

  const html = `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;font-family:'Inter',Arial,sans-serif;background:#0d0d1a;color:#e0e0e0;">
      <div style="max-width:520px;margin:40px auto;background:linear-gradient(135deg,#1a1a2e,#16213e);
                  border-radius:16px;border:1px solid rgba(0,255,200,0.2);overflow:hidden;">

        <!-- Header -->
        <div style="padding:32px 32px 24px;text-align:center;
                    background:linear-gradient(135deg,rgba(0,255,200,0.06),rgba(98,0,234,0.06));">
          <div style="font-size:2.5rem;margin-bottom:8px;">🏋️</div>
          <h1 style="margin:0;font-size:1.4rem;font-weight:700;color:#fff;">Fitness Planner AI</h1>
          <p style="margin:4px 0 0;font-size:0.85rem;color:#888;">Password Reset Request</p>
        </div>

        <!-- Body -->
        <div style="padding:28px 32px;">
          <p style="margin:0 0 16px;font-size:0.95rem;color:#ccc;">Hi <strong style="color:#fff;">${toName}</strong>,</p>
          <p style="margin:0 0 24px;font-size:0.9rem;color:#aaa;line-height:1.6;">
            We received a request to reset your password. Use the token below to complete your reset.
            This token expires in <strong style="color:#fff;">15 minutes</strong>.
          </p>

          <!-- Token box -->
          <div style="text-align:center;margin:24px 0;padding:20px;
                      background:rgba(0,255,200,0.06);border:1px solid rgba(0,255,200,0.25);
                      border-radius:12px;">
            <p style="margin:0 0 8px;font-size:0.75rem;color:#888;text-transform:uppercase;letter-spacing:0.1em;">Your Reset Token</p>
            <div style="font-size:2.2rem;font-weight:800;letter-spacing:0.4em;color:#00ffc8;">${resetToken}</div>
          </div>

          <p style="margin:0 0 8px;font-size:0.85rem;color:#aaa;line-height:1.6;">
            Go to the app, click <em>"Forgot Password?"</em>, and enter this token along with your new password.
          </p>
          <p style="margin:0;font-size:0.8rem;color:#666;line-height:1.6;">
            If you didn't request a password reset, you can safely ignore this email.
            Your password will not change.
          </p>
        </div>

        <!-- Footer -->
        <div style="padding:20px 32px;text-align:center;border-top:1px solid rgba(255,255,255,0.06);">
          <p style="margin:0;font-size:0.75rem;color:#555;">
            © ${new Date().getFullYear()} Fitness Planner AI — This is an automated email, please do not reply.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  if (!transporter) {
    // Dev fallback — log token to server console
    console.log('\n' + '═'.repeat(55));
    console.log('  📧  PASSWORD RESET TOKEN (email not configured)');
    console.log('═'.repeat(55));
    console.log(`  To:    ${toEmail}`);
    console.log(`  Token: ${resetToken}`);
    console.log('  (Set SMTP_USER + SMTP_PASS env vars to enable email)');
    console.log('═'.repeat(55) + '\n');
    return { sent: false, dev: true };
  }

  await transporter.sendMail({ from, to: toEmail, subject, html });
  return { sent: true };
}

module.exports = { sendResetEmail };
