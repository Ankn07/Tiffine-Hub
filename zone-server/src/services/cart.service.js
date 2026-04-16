const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const ProductVariant = require("../models/product-variant.model");
const { paginate } = require("../utils/paginate");

const _recalculate = (cart) => {
  cart.subtotal = cart.items.reduce((s, i) => s + i.total_price, 0);
  cart.total = Math.max(0, cart.subtotal - cart.discount);
  return cart;
};

const _getPrice = async (product_id, variant_id) => {
  if (variant_id) {
    const v = await ProductVariant.findOne({ _id: variant_id, is_deleted: false });
    if (!v) { const e = new Error("Variant not found"); e.status = 404; e.reason = "NOT_FOUND"; throw e; }
    return { price: v.price, name: v.variant_name, sku: v.sku, image_url: v.image_url };
  }
  const p = await Product.findOne({ _id: product_id, is_deleted: false });
  if (!p) { const e = new Error("Product not found"); e.status = 404; e.reason = "NOT_FOUND"; throw e; }
  return { price: p.price, name: p.name, sku: p.sku, image_url: p.images?.[0] || null };
};

const addItem = async ({ customer_id, store_id, product_id, variant_id, quantity }) => {
  const { price, name, sku, image_url } = await _getPrice(product_id, variant_id);

  let cart = await Cart.findOne({ customer_id });
  if (!cart) {
    cart = new Cart({ customer_id, store_id, items: [] });
  }

  const idx = cart.items.findIndex(
    (i) =>
      i.product_id.toString() === product_id &&
      (variant_id ? i.variant_id?.toString() === variant_id : !i.variant_id)
  );

  if (idx > -1) {
    cart.items[idx].quantity += quantity;
    cart.items[idx].total_price = cart.items[idx].quantity * cart.items[idx].unit_price;
  } else {
    cart.items.push({ product_id, variant_id: variant_id || null, name, sku, quantity, unit_price: price, total_price: price * quantity, image_url });
  }

  _recalculate(cart);
  await cart.save();
  return cart;
};

const getAll = async ({ page, limit }) => paginate(Cart, {}, { page, limit });

const getByCustomer = async (customerId) => {
  const cart = await Cart.findOne({ customer_id: customerId });
  if (!cart) { const e = new Error("Cart not found"); e.status = 404; e.reason = "NOT_FOUND"; throw e; }
  return cart;
};

const replaceCart = async (id, { items }) => {
  const cart = await Cart.findById(id);
  if (!cart) { const e = new Error("Cart not found"); e.status = 404; e.reason = "NOT_FOUND"; throw e; }
  const newItems = [];
  for (const item of items) {
    const { price, name, sku, image_url } = await _getPrice(item.product_id, item.variant_id);
    newItems.push({ product_id: item.product_id, variant_id: item.variant_id || null, name, sku, quantity: item.quantity, unit_price: price, total_price: price * item.quantity, image_url });
  }
  cart.items = newItems;
  _recalculate(cart);
  await cart.save();
  return cart;
};

const removeItem = async (id, { product_id, variant_id }) => {
  const cart = await Cart.findById(id);
  if (!cart) { const e = new Error("Cart not found"); e.status = 404; e.reason = "NOT_FOUND"; throw e; }
  cart.items = cart.items.filter(
    (i) => !(i.product_id.toString() === product_id && (variant_id ? i.variant_id?.toString() === variant_id : !i.variant_id))
  );
  _recalculate(cart);
  await cart.save();
  return cart;
};

const updateQuantity = async (id, { product_id, variant_id, action }) => {
  const cart = await Cart.findById(id);
  if (!cart) { const e = new Error("Cart not found"); e.status = 404; e.reason = "NOT_FOUND"; throw e; }
  const idx = cart.items.findIndex(
    (i) => i.product_id.toString() === product_id && (variant_id ? i.variant_id?.toString() === variant_id : !i.variant_id)
  );
  if (idx === -1) { const e = new Error("Item not found in cart"); e.status = 404; e.reason = "NOT_FOUND"; throw e; }

  if (action === "INCREASE") {
    cart.items[idx].quantity += 1;
  } else {
    cart.items[idx].quantity -= 1;
    if (cart.items[idx].quantity <= 0) cart.items.splice(idx, 1);
  }
  if (cart.items[idx]) cart.items[idx].total_price = cart.items[idx].quantity * cart.items[idx].unit_price;
  _recalculate(cart);
  await cart.save();
  return cart;
};

module.exports = { addItem, getAll, getByCustomer, replaceCart, removeItem, updateQuantity };
