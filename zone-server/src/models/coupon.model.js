const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    description: { type: String, default: "" },
    type: { type: String, enum: ["PERCENTAGE", "FLAT"], required: true },
    value: { type: Number, required: true, min: 0 },
    min_order_value: { type: Number, default: 0, min: 0 },
    max_discount: { type: Number, default: null },
    usage_limit: { type: Number, default: null },
    usage_count: { type: Number, default: 0 },
    per_user_limit: { type: Number, default: 1 },
    is_active: { type: Boolean, default: true, index: true },
    valid_from: { type: Date, required: true },
    valid_until: { type: Date, required: true },
    store_id: { type: String, default: null },
    is_public: { type: Boolean, default: false, index: true },
    is_deleted: { type: Boolean, default: false, index: true },
    deleted_at: { type: Date, default: null },
    deleted_by: { type: String, default: null },
    created_by: { type: String, default: null },
    updated_by: { type: String, default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  }
);

module.exports = mongoose.model("Coupon", couponSchema);
