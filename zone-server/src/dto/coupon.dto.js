const { z } = require("zod");

const createCouponDto = z.object({
  code: z.string().min(3,"Code must be at least 3 characters long").toUpperCase(),
  description: z.string().optional().default(""),
  type: z.enum(["PERCENTAGE", "FLAT"]),
  value: z.number().min(0),
  min_order_value: z.number().min(0).optional().default(0),
  max_discount: z.number().min(0).nullable().optional(),
  usage_limit: z.number().int().min(1).nullable().optional(),
  per_user_limit: z.number().int().min(1).optional().default(1),
  valid_from: z.string().datetime(),
  valid_until: z.string().datetime(),
  store_id: z.string().nullable().optional(),
  is_public: z.boolean().optional().default(false),
}).refine((d) => new Date(d.valid_from) < new Date(d.valid_until), {
  message: "valid_from must be before valid_until",
  path: ["valid_from"],
});

const updateCouponDto = createCouponDto.partial().refine((d) => {
  if (d.valid_from && d.valid_until) {
    return new Date(d.valid_from) < new Date(d.valid_until);
  }
  return true; // If one of the dates is not provided, skip this validation
}, {
  message: "valid_from must be before valid_until",
});

const couponStatusDto = z.object({ is_active: z.boolean() });

const validateCouponDto = z.object({
  customer_id: z.string().min(1),
  order_value: z.number().min(0),
});

module.exports = { createCouponDto, updateCouponDto, couponStatusDto, validateCouponDto };
