const ProductVariant = require("../models/product-variant.model");
const { paginate } = require("../utils/paginate");

const create = async (data) => {
  return await ProductVariant.create(data);
};

const getAll = async ({ page, limit, search, product_id }) => {
  const filter = { is_deleted: false };
  if (search) {
    filter.$or = [
      { variant_name: { $regex: search, $options: "i" } },
      { sku: { $regex: search, $options: "i" } },
    ];
  }
  if (product_id) filter.product_id = product_id;
  return await paginate(ProductVariant, filter, { page, limit });
};

const getById = async (id) => {
  const variant = await ProductVariant.findOne({ _id: id, is_deleted: false });
  if (!variant) {
    const err = new Error("Product variant not found");
    err.status = 404;
    err.reason = "NOT_FOUND";
    throw err;
  }
  return variant;
};

const update = async (id, data) => {
  const variant = await ProductVariant.findOneAndUpdate({ _id: id, is_deleted: false }, data, { new: true });
  if (!variant) {
    const err = new Error("Product variant not found");
    err.status = 404;
    err.reason = "NOT_FOUND";
    throw err;
  }
  return variant;
};

const updateStock = async (id, stock) => {
  const variant = await ProductVariant.findOneAndUpdate({ _id: id, is_deleted: false }, { stock }, { new: true });
  if (!variant) {
    const err = new Error("Product variant not found");
    err.status = 404;
    err.reason = "NOT_FOUND";
    throw err;
  }
  return variant;
};

const softDelete = async (id) => {
  const variant = await ProductVariant.findOneAndUpdate(
    { _id: id, is_deleted: false },
    { is_deleted: true, deleted_at: new Date() },
    { new: true }
  );
  if (!variant) {
    const err = new Error("Product variant not found");
    err.status = 404;
    err.reason = "NOT_FOUND";
    throw err;
  }
  return variant;
};

const getByProductId = async (productId, { page, limit }) => {
  const filter = { product_id: productId, is_deleted: false };
  return await paginate(ProductVariant, filter, { page, limit });
};

module.exports = { create, getAll, getById, update, updateStock, softDelete, getByProductId };
