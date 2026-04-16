const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true, index: true },
    user_type: { type: String, enum: ["CUSTOMER", "STORE_USER", "OPERATOR", "ADMIN"], required: true },
    type: { type: String, enum: ["ORDER", "PAYMENT", "REFUND", "DELIVERY", "SYSTEM", "PROMOTION"], required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    is_read: { type: Boolean, default: false, index: true },
    reference_id: { type: String, default: null },
    read_at: { type: Date, default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
    versionKey: false,
  }
);

module.exports = mongoose.model("Notification", notificationSchema);
