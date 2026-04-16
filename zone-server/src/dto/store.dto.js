const { z } = require("zod");

const workingHoursEntry = z.object({
  day: z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]),
  open_time: z.string().min(3),
  close_time: z.string().min(3),
});

const createStoreDto = z.object({
  name: z.string().min(2),
  phone_number: z.string().min(10),
  email: z.string().email().optional(),
  store_url: z.string().url().optional(),
  pin_code: z.number().int(),
  latitude: z.number(),
  longitude: z.number(),
  address: z.string().min(5),
  timezone: z.string().optional().default("Asia/Kolkata"),
  category_id: z.string().min(1),
  upi_id: z.string().optional(),
  gstin: z.string().optional(),
  is_doordrop: z.boolean().optional().default(false),
  is_refund: z.boolean().optional().default(false),
  logo_url: z.string().optional(),
  banner_url: z.string().optional(),
  working_hours: z.array(workingHoursEntry).optional().default([]),
  created_by: z.string().optional(),
});

const updateStoreDto = createStoreDto.partial();

const storeStatusDto = z.object({
  status: z.enum(["ACTIVE", "INACTIVE", "BLOCKED"]),
  updated_by: z.string().optional(),
});

module.exports = { createStoreDto, updateStoreDto, storeStatusDto };
