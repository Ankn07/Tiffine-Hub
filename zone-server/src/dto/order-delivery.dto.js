const { z } = require("zod");

const createOrderDeliveryDto = z.object({
  order_id: z.string().min(1),
  delivery_person: z.string().min(1),
  phone: z.string().min(10).max(15),
  tracking_url: z.string().url().optional(),
  estimated_at: z.string().datetime().optional(),
});

const updateOrderDeliveryDto = z.object({
  delivery_person: z.string().optional(),
  phone: z.string().min(10).max(15).optional(),
  status: z.enum(["ASSIGNED", "PICKED_UP", "IN_TRANSIT", "DELIVERED", "FAILED"]).optional(),
  tracking_url: z.string().url().optional(),
  estimated_at: z.string().datetime().optional(),
  delivered_at: z.string().datetime().optional(),
  failed_reason: z.string().optional(),
});

module.exports = { createOrderDeliveryDto, updateOrderDeliveryDto };
