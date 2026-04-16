const slugify = require("slugify");
const Store = require("../models/store.model");
const { paginate } = require("../utils/paginate");

const create = async (data) => {
  const slug = slugify(data.name, { lower: true, strict: true });
  return await Store.create({ ...data, slug });
};

const getAll = async ({ page, limit, search, status, category_id, pin_code }) => {
  const filter = { is_deleted: false };
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { slug: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { address: { $regex: search, $options: "i" } },
    ];
  }
  if (status) filter.status = status;
  if (category_id) filter.category_id = category_id;
  if (pin_code) filter.pin_code = Number(pin_code);
  return await paginate(Store, filter, { page, limit });
};

const getById = async (id) => {
  const store = await Store.findOne({ _id: id, is_deleted: false });
  if (!store) {
    const err = new Error("Store not found");
    err.status = 404;
    err.reason = "NOT_FOUND";
    throw err;
  }
  return store;
};

const update = async (id, data) => {
  if (data.name) data.slug = slugify(data.name, { lower: true, strict: true });
  const store = await Store.findOneAndUpdate({ _id: id, is_deleted: false }, data, { new: true });
  if (!store) {
    const err = new Error("Store not found");
    err.status = 404;
    err.reason = "NOT_FOUND";
    throw err;
  }
  return store;
};

const updateStatus = async (id, data) => {
  const store = await Store.findOneAndUpdate({ _id: id, is_deleted: false }, data, { new: true });
  if (!store) {
    const err = new Error("Store not found");
    err.status = 404;
    err.reason = "NOT_FOUND";
    throw err;
  }
  return store;
};

const softDelete = async (id) => {
  const store = await Store.findOneAndUpdate(
    { _id: id, is_deleted: false },
    { is_deleted: true, deleted_at: new Date() },
    { new: true }
  );
  if (!store) {
    const err = new Error("Store not found");
    err.status = 404;
    err.reason = "NOT_FOUND";
    throw err;
  }
  return store;
};

const getByPinCode = async (pinCode, { page, limit }) => {
  const filter = { pin_code: Number(pinCode), is_deleted: false, status: "ACTIVE" };
  return await paginate(Store, filter, { page, limit });
};

module.exports = { create, getAll, getById, update, updateStatus, softDelete, getByPinCode };
