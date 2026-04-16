const { z } = require("zod");

const createCouponUsageDto = z.object({
  coupon_id: z.string().min(1),
  customer_id: z.string().min(1),
  order_id: z.string().min(1),
  discount: z.number().min(0),
});

module.exports = { createCouponUsageDto };
