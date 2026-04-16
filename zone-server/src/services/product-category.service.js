const slugify = require("slugify");
const ProductCategory = require("../models/product-category.model");
const { paginate } = require("../utils/paginate");

const create = async (data) => {
  const slug = slugify(data.name, { lower: true, strict: true });
  return await ProductCategory.create({ ...data, slug });
};

const getAll = async ({ page, limit, search, store_id }) => {
  const filter = { is_deleted: false };
  if (search) filter.name = { $regex: search, $options: "i" };
  if (store_id) filter.store_id = store_id;
  return await paginate(ProductCategory, filter, { page, limit });
};

const getById = async (id) => {
  const cat = await ProductCategory.findOne({ _id: id, is_deleted: false });
  if (!cat) {
    const err = new Error("Product category not found");
    err.status = 404;
    err.reason = "NOT_FOUND";
    throw err;
  }
  return cat;
};

const update = async (id, data) => {
  if (data.name) data.slug = slugify(data.name, { lower: true, strict: true });
  const cat = await ProductCategory.findOneAndUpdate({ _id: id, is_deleted: false }, data, { new: true });
  if (!cat) {
    const err = new Error("Product category not found");
    err.status = 404;
    err.reason = "NOT_FOUND";
    throw err;
  }
  return cat;
};

const softDelete = async (id) => {
  const cat = await ProductCategory.findOneAndUpdate(
    { _id: id, is_deleted: false },
    { is_deleted: true, deleted_at: new Date() },
    { new: true }
  );
  if (!cat) {
    const err = new Error("Product category not found");
    err.status = 404;
    err.reason = "NOT_FOUND";
    throw err;
  }
  return cat;
};

module.exports = { create, getAll, getById, update, softDelete };
