const mongoose = require("mongoose");

const couponUsageSchema = new mongoose.Schema(
  {
    coupon_id: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon", required: true, index: true },
    customer_id: { type: String, required: true, index: true },
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    discount: { type: Number, required: true, min: 0 },
    used_at: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

module.exports = mongoose.model("CouponUsage", couponUsageSchema);
