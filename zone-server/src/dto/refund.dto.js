const { z } = require("zod");

const createRefundDto = z.object({
  order_id: z.string().min(1),
  payment_id: z.string().min(1),
  customer_id: z.string().min(1),
  amount: z.number().min(0),
  reason: z.string().min(1),
  upi_id: z.string().optional(),
});

const refundStatusDto = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  note: z.string().optional().default(""),
});

module.exports = { createRefundDto, refundStatusDto };
