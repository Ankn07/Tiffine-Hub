const Wishlist = require("../models/wishlist.model");
const Product = require("../models/product.model");
const ProductVariant = require("../models/product-variant.model");
const { paginate } = require("../utils/paginate");

const _getProductInfo = async (product_id, variant_id) => {
  if (variant_id) {
    const v = await ProductVariant.findOne({ _id: variant_id, is_deleted: false });
    if (!v) { const e = new Error("Variant not found"); e.status = 404; e.reason = "NOT_FOUND"; throw e; }
    return { name: v.variant_name, price: v.price, image_url: v.image_url };
  }
  const p = await Product.findOne({ _id: product_id, is_deleted: false });
  if (!p) { const e = new Error("Product not found"); e.status = 404; e.reason = "NOT_FOUND"; throw e; }
  return { name: p.name, price: p.price, image_url: p.images?.[0] || null };
};

const addItem = async ({ customer_id, product_id, variant_id }) => {
  const { name, price, image_url } = await _getProductInfo(product_id, variant_id);
  let wishlist = await Wishlist.findOne({ customer_id });
  if (!wishlist) wishlist = new Wishlist({ customer_id, items: [] });

  const exists = wishlist.items.some(
    (i) => i.product_id.toString() === product_id && (variant_id ? i.variant_id?.toString() === variant_id : !i.variant_id)
  );
  if (!exists) wishlist.items.push({ product_id, variant_id: variant_id || null, name, price, image_url });
  await wishlist.save();
  return wishlist;
};

const getAll = async ({ page, limit }) => paginate(Wishlist, {}, { page, limit });

const getByCustomer = async (customerId) => {
  const wl = await Wishlist.findOne({ customer_id: customerId });
  if (!wl) { const e = new Error("Wishlist not found"); e.status = 404; e.reason = "NOT_FOUND"; throw e; }
  return wl;
};

const replaceItems = async (id, body) => {
  const wl = await Wishlist.findById(id);
  if (!wl) { const e = new Error("Wishlist not found"); e.status = 404; e.reason = "NOT_FOUND"; throw e; }
  wl.items = body.items || [];
  await wl.save();
  return wl;
};

const removeItem = async (id, { product_id, variant_id }) => {
  const wl = await Wishlist.findById(id);
  if (!wl) { const e = new Error("Wishlist not found"); e.status = 404; e.reason = "NOT_FOUND"; throw e; }
  wl.items = wl.items.filter(
    (i) => !(i.product_id.toString() === product_id && (variant_id ? i.variant_id?.toString() === variant_id : !i.variant_id))
  );
  await wl.save();
  return wl;
};

const toggleItem = async (id, { product_id, variant_id }) => {
  const wl = await Wishlist.findById(id);
  if (!wl) { const e = new Error("Wishlist not found"); e.status = 404; e.reason = "NOT_FOUND"; throw e; }
  const idx = wl.items.findIndex(
    (i) => i.product_id.toString() === product_id && (variant_id ? i.variant_id?.toString() === variant_id : !i.variant_id)
  );
  if (idx > -1) {
    wl.items.splice(idx, 1);
  } else {
    const { name, price, image_url } = await _getProductInfo(product_id, variant_id);
    wl.items.push({ product_id, variant_id: variant_id || null, name, price, image_url });
  }
  await wl.save();
  return wl;
};

module.exports = { addItem, getAll, getByCustomer, replaceItems, removeItem, toggleItem };
