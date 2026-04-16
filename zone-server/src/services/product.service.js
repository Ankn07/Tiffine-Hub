const Product = require("../models/product.model");
const { paginate } = require("../utils/paginate");

const create = async (data) => {
  return await Product.create(data);
};

const getAll = async ({ page, limit, search, store_id, category_id, type, tax_status }) => {
  const filter = { is_deleted: false };
  if (search) {
    filter.$text = { $search: search };
  }
  if (store_id) filter.store_id = store_id;
  if (category_id) filter.category_id = category_id;
  if (type) filter.type = type;
  if (tax_status) filter.tax_status = tax_status;
  return await paginate(Product, filter, { page, limit });
};

const getById = async (id) => {
  const product = await Product.findOne({ _id: id, is_deleted: false });
  if (!product) {
    const err = new Error("Product not found");
    err.status = 404;
    err.reason = "NOT_FOUND";
    throw err;
  }
  return product;
};

const update = async (id, data) => {
  const product = await Product.findOneAndUpdate({ _id: id, is_deleted: false }, data, { new: true });
  if (!product) {
    const err = new Error("Product not found");
    err.status = 404;
    err.reason = "NOT_FOUND";
    throw err;
  }
  return product;
};

const updateStock = async (id, stock) => {
  const product = await Product.findOneAndUpdate({ _id: id, is_deleted: false }, { stock }, { new: true });
  if (!product) {
    const err = new Error("Product not found");
    err.status = 404;
    err.reason = "NOT_FOUND";
    throw err;
  }
  return product;
};

const softDelete = async (id) => {
  const product = await Product.findOneAndUpdate(
    { _id: id, is_deleted: false },
    { is_deleted: true, deleted_at: new Date() },
    { new: true }
  );
  if (!product) {
    const err = new Error("Product not found");
    err.status = 404;
    err.reason = "NOT_FOUND";
    throw err;
  }
  return product;
};

const getByStoreId = async (storeId, { page, limit, search, category_id }) => {
  const filter = { store_id: storeId, is_deleted: false };
  if (search) filter.$text = { $search: search };
  if (category_id) filter.category_id = category_id;
  return await paginate(Product, filter, { page, limit });
};

module.exports = { create, getAll, getById, update, updateStock, softDelete, getByStoreId };
