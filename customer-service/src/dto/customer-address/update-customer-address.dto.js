'use strict';

const { z } = require('zod');

const UpdateCustomerAddressDto = z.object({
  full_name: z.string().min(2).optional(),
  phone: z.string().min(7).max(20).optional(),
  address_line_1: z.string().min(3).optional(),
  address_line_2: z.string().optional().nullable(),
  landmark: z.string().optional().nullable(),
  city: z.string().min(1).optional(),
  state: z.string().min(1).optional(),
  country: z.string().min(1).optional(),
  pin_code: z.number().int().positive().optional(),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
  address_type: z.enum(['HOME', 'WORK', 'OTHER']).optional(),
  is_default: z.boolean().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update',
});

module.exports = UpdateCustomerAddressDto;
