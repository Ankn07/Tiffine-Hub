const mongoose = require("mongoose");

const orderStatusHistorySchema = new mongoose.Schema(
  {
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true, index: true },
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "PACKED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED", "REFUNDED"],
      required: true,
    },
    note: { type: String, default: "" },
    changed_by: { type: String, required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
    versionKey: false,
  }
);

module.exports = mongoose.model("OrderStatusHistory", orderStatusHistorySchema);
