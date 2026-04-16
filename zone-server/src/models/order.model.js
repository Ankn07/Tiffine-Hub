const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    variant_id: { type: mongoose.Schema.Types.ObjectId, ref: "ProductVariant", default: null },
    name: { type: String, required: true },
    sku: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unit_price: { type: Number, required: true, min: 0 },
    total_price: { type: Number, required: true, min: 0 },
    image_url: { type: String, default: null },
  },
  { _id: true, timestamps: { createdAt: "created_at", updatedAt: false } }
);

const addressSchema = new mongoose.Schema(
  {
    line1: { type: String, required: true },
    line2: { type: String, default: "" },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pin_code: { type: Number, required: true },
    country: { type: String, default: "India" },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    order_no: { type: String, unique: true, index: true },
    customer_id: { type: String, required: true, index: true },
    store_id: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true, index: true },
    items: [orderItemSchema],
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "PACKED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED", "REFUNDED"],
      default: "PENDING",
      index: true,
    },
    subtotal: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    coupon_id: { type: String, default: null },
    delivery_charge: { type: Number, default: 0, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    payment_status: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED", "REFUNDED"],
      default: "PENDING",
      index: true,
    },
    payment_id: { type: String, default: null },
    delivery_id: { type: String, default: null },
    note: { type: String, default: "" },
    address: { type: addressSchema, required: true },
    is_deleted: { type: Boolean, default: false, index: true },
    deleted_at: { type: Date, default: null },
    deleted_by: { type: String, default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  }
);

// Auto-generate order_no before save
orderSchema.pre("save", async function (next) {
  if (!this.order_no) {
    const now = new Date();
    const date = now.toISOString().slice(0, 10).replace(/-/g, "");
    const count = await this.constructor.countDocuments();
    this.order_no = `ORD-${date}-${String(count + 1).padStart(4, "0")}`;
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);
