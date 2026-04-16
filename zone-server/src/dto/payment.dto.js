const { z } = require("zod");

const createPaymentDto = z.object({
  order_id: z.string().min(1),
  customer_id: z.string().min(1),
  amount: z.number().min(0),
  method: z.enum(["UPI", "CASH", "ONLINE"]),
});

const verifyPaymentDto = z.object({
  payment_id: z.string().min(1),
  upi_txn_id: z.string().min(1),
  upi_ref_id: z.string().optional(),
  gateway_response: z.record(z.any()).optional(),
});

const failurePaymentDto = z.object({
  payment_id: z.string().min(1),
  reason: z.string().optional().default("Payment failed"),
  gateway_response: z.record(z.any()).optional(),
});

module.exports = { createPaymentDto, verifyPaymentDto, failurePaymentDto };
