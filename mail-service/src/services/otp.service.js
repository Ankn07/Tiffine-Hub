import { otpRepository } from '../repositories/otp.repository.js';
import { mailLogRepository } from '../repositories/mailLog.repository.js';
import { generateOtpCode, getOtpExpiry } from '../utils/otp.js';
import { sendMail } from '../utils/mailer.js';
import { logger } from '../config/logger.js';

export const otpService = {
  async send({ email, purpose }) {
    // Expire any existing PENDING OTPs for this email + purpose
    await otpRepository.expireOldOtps(email, purpose);

    const otp_code = generateOtpCode();
    const expires_at = getOtpExpiry();

    const otp = await otpRepository.create({ email, otp_code, purpose, expires_at });

    const subject = 'Your One-Time Password (OTP)';
    const html = `
      <div style="font-family:sans-serif;max-width:480px;margin:auto">
        <h2>Your OTP Code</h2>
        <p>Use the code below to complete your action. It expires in <strong>5 minutes</strong>.</p>
        <div style="font-size:2rem;font-weight:bold;letter-spacing:.25rem;padding:16px;background:#f5f5f5;border-radius:8px;text-align:center">
          ${otp_code}
        </div>
        <p style="color:#888;font-size:.85rem;margin-top:16px">If you did not request this, please ignore this email.</p>
      </div>
    `;

    try {
      await sendMail({ to: email, subject, html, text: `Your OTP code is: ${otp_code}. It expires in 5 minutes.` });
    } catch (mailErr) {
      logger.error('Failed to send OTP email', { email, error: mailErr.message });
      // Mark the OTP as failed so it cannot be used
      await otpRepository.markExpired(otp.id);
      const err = new Error('Failed to send OTP email. Please try again.');
      err.statusCode = 502;
      throw err;
    }

    return { message: 'OTP sent successfully', expires_at };
  },

  async verify({ email, otp_code, purpose }) {
    const otp = await otpRepository.findValidOtp(email, purpose);

    if (!otp) {
      const err = new Error('No valid OTP found. It may have expired or already been used.');
      err.statusCode = 400;
      throw err;
    }

    if (otp.otp_code !== otp_code) {
      const err = new Error('Invalid OTP code');
      err.statusCode = 400;
      throw err;
    }

    await otpRepository.markVerified(otp.id);

    return { message: 'OTP verified successfully', verified_at: new Date() };
  },
};
