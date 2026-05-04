const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true, index: true },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    customer_id: { type: String, required: true, index: true },
    store_id: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: "" },
    images: { type: [String], default: [] },
    is_verified: { type: Boolean, default: false },
    is_deleted: { type: Boolean, default: false, index: true },
    deleted_at: { type: Date, default: null },
    deleted_by: { type: String, default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  }
);

reviewSchema.index({ product_id: 1 });

module.exports = mongoose.model("Review", reviewSchema);
