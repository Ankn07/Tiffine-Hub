const { z } = require("zod");

const pinCodeEntry = z.object({
  post_office: z.string().min(2),
  pin_code: z.number().int().min(100000).max(999999),
});

const createZoneDto = z.object({
  area: z.string().min(2),
  zone_name: z.string().min(2),
  latitude: z.number(),
  longitude: z.number(),
  operator_id: z.string().min(1),
  zone: z.array(pinCodeEntry).optional().default([]),
  created_by: z.string().optional(),
});

const updateZoneDto = z.object({
  area: z.string().min(2).optional(),
  zone_name: z.string().min(2).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  updated_by: z.string().optional(),
});

const singlePinCodeDto = z.object({
  zone_id: z.string().min(1),
  post_office: z.string().min(2).optional(),
  pin_code: z.number().int().min(100000).max(999999),
});

const bulkPinCodeDto = z.object({
  zone_id: z.string().min(1),
  pin_codes: z.array(z.number().int()).optional(),
  zone: z.array(pinCodeEntry).optional(),
});

module.exports = { createZoneDto, updateZoneDto, singlePinCodeDto, bulkPinCodeDto };
