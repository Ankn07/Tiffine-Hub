'use strict';

const { z } = require('zod');

const CreateCustomerDto = z.object({
  first_name: z.string().min(2, 'first_name must be at least 2 characters'),
  last_name: z.string().min(1, 'last_name must be at least 1 character').optional(),
  phone: z.string().min(7, 'phone is required').max(20),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'password must be at least 8 characters'),
  profile_image_url: z.string().url('Invalid URL').optional(),
});

module.exports = CreateCustomerDto;
