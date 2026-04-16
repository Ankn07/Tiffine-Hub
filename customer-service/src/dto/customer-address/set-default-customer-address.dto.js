'use strict';

const { z } = require('zod');

// Body is empty for this PATCH — the action is implied by the route.
// We keep this DTO as a no-op passthrough so the middleware chain is consistent.
const SetDefaultCustomerAddressDto = z.object({}).passthrough();

module.exports = SetDefaultCustomerAddressDto;
