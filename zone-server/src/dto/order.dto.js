const { z } = require("zod");

const orderItemDto = z.object({
  product_id: z.string().min(1),
  variant_id: z.string().nullable().optional(),
  quantity: z.number().int().min(1),
  unit_price: z.number().min(0),
});

const addressDto = z.object({
  line1: z.string().min(1),
  line2: z.string().optional().default(""),
  city: z.string().min(1),
  state: z.string().min(1),
  pin_code: z.number().int(),
  country: z.string().optional().default("India"),
});

const createOrderDto = z.object({
  customer_id: z.string().min(1),
  store_id: z.string().min(1),
  items: z.array(orderItemDto).min(1),
  coupon_id: z.string().nullable().optional(),
  delivery_charge: z.number().min(0).optional().default(0),
  tax: z.number().min(0).optional().default(0),
  note: z.string().optional().default(""),
  address: addressDto,
});

const cancelOrderDto = z.object({ reason: z.string().optional().default("") });
const statusNoteDto = z.object({ note: z.string().optional().default("") });

module.exports = { createOrderDto, cancelOrderDto, statusNoteDto };
