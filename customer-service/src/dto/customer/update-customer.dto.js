'use strict';

const { z } = require('zod');

const UpdateCustomerDto = z.object({
  first_name: z.string().min(2).optional(),
  last_name: z.string().min(1).optional(),
  phone: z.string().min(7).max(20).optional(),
  email: z.string().email('Invalid email address').optional(),
  profile_image_url: z.string().url('Invalid URL').optional().nullable(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update',
});

module.exports = UpdateCustomerDto;
