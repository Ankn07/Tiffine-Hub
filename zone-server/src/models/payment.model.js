const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true, index: true },
    customer_id: { type: String, required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "INR" },
    method: { type: String, enum: ["UPI", "CASH", "ONLINE"], required: true },
    status: { type: String, enum: ["PENDING", "SUCCESS", "FAILED", "REFUNDED"], default: "PENDING", index: true },
    upi_txn_id: { type: String, default: null },
    upi_ref_id: { type: String, default: null },
    payment_gateway: { type: String, default: null },
    gateway_response: { type: mongoose.Schema.Types.Mixed, default: null },
    paid_at: { type: Date, default: null },
    failed_at: { type: Date, default: null },
    failure_reason: { type: String, default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  }
);

module.exports = mongoose.model("Payment", paymentSchema);
