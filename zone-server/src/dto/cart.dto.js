const { z } = require("zod");

const addToCartDto = z.object({
  customer_id: z.string().min(1),
  store_id: z.string().min(1),
  product_id: z.string().min(1),
  variant_id: z.string().nullable().optional(),
  quantity: z.number().int().min(1).default(1),
});

const updateCartItemDto = z.object({
  product_id: z.string().min(1),
  variant_id: z.string().nullable().optional(),
  action: z.enum(["INCREASE", "DECREASE"]),
});

const replaceCartDto = z.object({
  items: z.array(
    z.object({
      product_id: z.string().min(1),
      variant_id: z.string().nullable().optional(),
      quantity: z.number().int().min(1),
    })
  ).min(1),
});

module.exports = { addToCartDto, updateCartItemDto, replaceCartDto };
