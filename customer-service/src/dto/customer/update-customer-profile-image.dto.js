'use strict';

const { z } = require('zod');

const UpdateCustomerProfileImageDto = z.object({
  profile_image_url: z.string().url('Must be a valid URL'),
});

module.exports = UpdateCustomerProfileImageDto;
