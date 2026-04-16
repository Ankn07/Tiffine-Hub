'use strict';

const { z } = require('zod');

const QueryCustomerAddressDto = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  address_type: z.enum(['HOME', 'WORK', 'OTHER']).optional(),
  sort_by: z.enum(['created_at', 'address_type', 'is_default']).optional().default('created_at'),
  sort_order: z.enum(['asc', 'desc']).optional().default('desc'),
});

module.exports = QueryCustomerAddressDto;
