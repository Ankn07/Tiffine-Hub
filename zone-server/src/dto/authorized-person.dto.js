const { z } = require("zod");

const createAuthorizedPersonDto = z.object({
  name: z.string().min(2),
  phone_number: z.string().min(10).max(15),
  email: z.string().email(),
  operator_id: z.string().min(1),
  role: z.enum(["MANAGER", "STAFF", "SUPPORT", "DELIVERY"]),
  created_by: z.string().optional(),
});

const updateAuthorizedPersonDto = z.object({
  name: z.string().min(2).optional(),
  phone_number: z.string().min(10).max(15).optional(),
  email: z.string().email().optional(),
  role: z.enum(["MANAGER", "STAFF", "SUPPORT", "DELIVERY"]).optional(),
  updated_by: z.string().optional(),
});

const loginAuthorizedPersonDto = z.object({
  email: z.string().email(),
});

const verifyOtpDto = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
});

module.exports = {
  createAuthorizedPersonDto,
  updateAuthorizedPersonDto,
  loginAuthorizedPersonDto,
  verifyOtpDto,
};
