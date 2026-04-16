const { z } = require("zod");

const addToWishlistDto = z.object({
  customer_id: z.string().min(1),
  product_id: z.string().min(1),
  variant_id: z.string().nullable().optional(),
});

const toggleWishlistDto = z.object({
  product_id: z.string().min(1),
  variant_id: z.string().nullable().optional(),
});

module.exports = { addToWishlistDto, toggleWishlistDto };
