const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    variant_id: { type: mongoose.Schema.Types.ObjectId, ref: "ProductVariant", default: null },
    name: { type: String, required: true },
    sku: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    unit_price: { type: Number, required: true, min: 0 },
    total_price: { type: Number, required: true, min: 0 },
    image_url: { type: String, default: null },
  },
  { _id: true }
);

const cartSchema = new mongoose.Schema(
  {
    customer_id: { type: String, required: true, index: true },
    store_id: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },
    items: [cartItemSchema],
    coupon_id: { type: String, default: null },
    subtotal: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  }
);

cartSchema.index({ customer_id: 1 }, { unique: true });

module.exports = mongoose.model("Cart", cartSchema);
