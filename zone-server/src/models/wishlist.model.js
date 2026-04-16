const mongoose = require("mongoose");

const wishlistItemSchema = new mongoose.Schema(
  {
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    variant_id: { type: mongoose.Schema.Types.ObjectId, ref: "ProductVariant", default: null },
    name: { type: String, required: true },
    image_url: { type: String, default: null },
    price: { type: Number, required: true, min: 0 },
    added_at: { type: Date, default: Date.now },
  },
  { _id: true }
);

const wishlistSchema = new mongoose.Schema(
  {
    customer_id: { type: String, required: true, unique: true, index: true },
    items: [wishlistItemSchema],
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  }
);

module.exports = mongoose.model("Wishlist", wishlistSchema);
