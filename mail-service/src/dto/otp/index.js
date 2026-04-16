import { z } from 'zod';

const OtpPurpose = z.enum(['ADMIN_LOGIN', 'AUTHORIZED_PERSON_LOGIN', 'PASSWORD_RESET']);

export const SendOtpDto = z.object({
  email: z.string().email(),
  purpose: OtpPurpose,
});

export const VerifyOtpDto = z.object({
  email: z.string().email(),
  otp_code: z.string().length(6).regex(/^\d{6}$/, 'OTP must be 6 digits'),
  purpose: OtpPurpose,
});
