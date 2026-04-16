import { otpService } from '../services/otp.service.js';
import { SendOtpDto, VerifyOtpDto } from '../dto/otp/index.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const otpController = {
  async send(req, res) {
    const parsed = SendOtpDto.safeParse(req.body);
    if (!parsed.success) {
      return sendError(res, { statusCode: 400, message: 'Validation failed', reason: 'VALIDATION_ERROR', detail: parsed.error.errors[0].message });
    }
    try {
      const data = await otpService.send(parsed.data);
      return sendSuccess(res, { statusCode: 200, message: data.message, data: { expires_at: data.expires_at } });
    } catch (err) {
      return sendError(res, { statusCode: err.statusCode ?? 500, message: err.message, reason: 'OTP_SEND_FAILED' });
    }
  },

  async verify(req, res) {
    const parsed = VerifyOtpDto.safeParse(req.body);
    if (!parsed.success) {
      return sendError(res, { statusCode: 400, message: 'Validation failed', reason: 'VALIDATION_ERROR', detail: parsed.error.errors[0].message });
    }
    try {
      const data = await otpService.verify(parsed.data);
      return sendSuccess(res, { statusCode: 200, message: data.message, data: { verified_at: data.verified_at } });
    } catch (err) {
      return sendError(res, { statusCode: err.statusCode ?? 400, message: err.message, reason: 'OTP_VERIFY_FAILED' });
    }
  },
};
