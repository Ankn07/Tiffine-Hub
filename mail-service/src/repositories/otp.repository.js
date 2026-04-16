import prisma from '../config/prisma.js';

export const otpRepository = {
  async create(data) {
    return prisma.oTP.create({ data });
  },

  /**
   * Find the latest PENDING OTP for an email + purpose that hasn't expired.
   */
  async findValidOtp(email, purpose) {
    return prisma.oTP.findFirst({
      where: {
        email,
        purpose,
        status: 'PENDING',
        expires_at: { gt: new Date() },
      },
      orderBy: { created_at: 'desc' },
    });
  },

  async markVerified(id) {
    return prisma.oTP.update({
      where: { id },
      data: { status: 'VERIFIED', verified_at: new Date() },
    });
  },

  async markExpired(id) {
    return prisma.oTP.update({
      where: { id },
      data: { status: 'EXPIRED' },
    });
  },

  /**
   * Expire all old PENDING OTPs for an email+purpose before issuing a new one.
   */
  async expireOldOtps(email, purpose) {
    return prisma.oTP.updateMany({
      where: { email, purpose, status: 'PENDING' },
      data: { status: 'EXPIRED' },
    });
  },
};
