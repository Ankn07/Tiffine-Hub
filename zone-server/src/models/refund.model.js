const mongoose = require("mongoose");

const refundSchema = new mongoose.Schema(
  {
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true, index: true },
    payment_id: { type: mongoose.Schema.Types.ObjectId, ref: "Payment", required: true, index: true },
    customer_id: { type: String, required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    reason: { type: String, required: true },
    status: { type: String, enum: ["PENDING", "APPROVED", "REJECTED", "PROCESSED"], default: "PENDING", index: true },
    upi_id: { type: String, default: null },
    txn_id: { type: String, default: null },
    note: { type: String, default: "" },
    processed_at: { type: Date, default: null },
    rejected_at: { type: Date, default: null },
    processed_by: { type: String, default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  }
);

module.exports = mongoose.model("Refund", refundSchema);
