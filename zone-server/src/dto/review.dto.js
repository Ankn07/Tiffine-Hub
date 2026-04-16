const { z } = require("zod");

const createReviewDto = z.object({
  order_id: z.string().min(1),
  product_id: z.string().min(1),
  customer_id: z.string().min(1),
  store_id: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional().default(""),
  images: z.array(z.string()).optional().default([]),
});

const updateReviewDto = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().optional(),
  images: z.array(z.string()).optional(),
});

module.exports = { createReviewDto, updateReviewDto };
