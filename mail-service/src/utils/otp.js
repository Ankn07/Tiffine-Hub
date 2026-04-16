import { randomInt } from 'crypto';

/**
 * Generate a 6-digit OTP code.
 * Uses crypto.randomInt for cryptographically secure randomness.
 */
export const generateOtpCode = () => {
  return String(randomInt(100000, 999999));
};

/**
 * Return the expiry Date (5 minutes from now).
 */
export const getOtpExpiry = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() + 5);
  return d;
};
