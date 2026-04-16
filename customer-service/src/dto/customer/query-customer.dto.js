'use strict';

const { z } = require('zod');

const QueryCustomerDto = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  search: z.string().max(100).optional(),
  sort_by: z.enum(['created_at', 'first_name', 'last_name', 'email']).optional().default('created_at'),
  sort_order: z.enum(['asc', 'desc']).optional().default('desc'),
});

module.exports = QueryCustomerDto;
