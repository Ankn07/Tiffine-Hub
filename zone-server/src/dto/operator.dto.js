const { z } = require("zod");

const createOperatorDto = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  phone_number: z.string().min(10).max(15),
  business_type: z.string().min(2),
  upi_id: z.string().optional(),
  created_by: z.string().optional(),
});

const updateOperatorDto = z.object({
  name: z.string().min(3).optional(),
  email: z.string().email().optional(),
  phone_number: z.string().min(10).max(15).optional(),
  business_type: z.string().optional(),
  upi_id: z.string().optional(),
  updated_by: z.string().optional(),
});

const statusOperatorDto = z.object({
  is_active: z.boolean(),
  updated_by: z.string().optional(),
});

const assignOperatorDto = z.object({
  zone_id: z.string().optional(),
  authorized_person_id: z.string().optional(),
  updated_by: z.string().optional(),
});

module.exports = { createOperatorDto, updateOperatorDto, statusOperatorDto, assignOperatorDto };
