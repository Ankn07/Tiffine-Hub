const { z } = require("zod");

const createOrderStatusHistoryDto = z.object({
  order_id: z.string().min(1),
  status: z.enum(["PENDING", "CONFIRMED", "PACKED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED", "REFUNDED"]),
  note: z.string().optional().default(""),
  changed_by: z.string().min(1),
});

module.exports = { createOrderStatusHistoryDto };
