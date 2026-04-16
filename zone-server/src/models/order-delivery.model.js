const mongoose = require("mongoose");

const orderDeliverySchema = new mongoose.Schema(
  {
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true, unique: true, index: true },
    delivery_person: { type: String, required: true },
    phone: { type: String, required: true },
    status: {
      type: String,
      enum: ["ASSIGNED", "PICKED_UP", "IN_TRANSIT", "DELIVERED", "FAILED"],
      default: "ASSIGNED",
      index: true,
    },
    tracking_url: { type: String, default: null },
    estimated_at: { type: Date, default: null },
    delivered_at: { type: Date, default: null },
    failed_reason: { type: String, default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  }
);

module.exports = mongoose.model("OrderDelivery", orderDeliverySchema);
