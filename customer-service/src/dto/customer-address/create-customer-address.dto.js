'use strict';

const { z } = require('zod');

const CreateCustomerAddressDto = z.object({
  full_name: z.string().min(2, 'full_name is required'),
  phone: z.string().min(7, 'phone is required').max(20),
  address_line_1: z.string().min(3, 'address_line_1 is required'),
  address_line_2: z.string().optional(),
  landmark: z.string().optional(),
  city: z.string().min(1, 'city is required'),
  state: z.string().min(1, 'state is required'),
  country: z.string().min(1, 'country is required'),
  pin_code: z.number().int().positive('pin_code must be a positive integer'),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  address_type: z.enum(['HOME', 'WORK', 'OTHER']).default('HOME'),
  is_default: z.boolean().optional().default(false),
});

module.exports = CreateCustomerAddressDto;
