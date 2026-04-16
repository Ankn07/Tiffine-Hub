const bcrypt = require("bcryptjs");
const StoreUser = require("../models/store-user.model");
const { paginate } = require("../utils/paginate");

const create = async (data) => {
  const existing = await StoreUser.findOne({ username: data.username.toLowerCase() });
  if (existing) {
    const err = new Error("Username already taken");
    err.status = 409;
    err.reason = "DUPLICATE_USERNAME";
    throw err;
  }
  const hashed = await bcrypt.hash(data.password, 10);
  return await StoreUser.create({ ...data, password: hashed, username: data.username.toLowerCase() });
};

const getAll = async ({ page, limit, search, store_id, role, status }) => {
  const filter = { is_deleted: false };
  if (search) {
    filter.$or = [
      { first_name: { $regex: search, $options: "i" } },
      { last_name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { username: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }
  if (store_id) filter.store_id = store_id;
  if (role) filter.role = role;
  if (typeof status !== "undefined") filter.is_published = status === "true" || status === true;
  return await paginate(StoreUser, filter, { page, limit });
};

const getById = async (id) => {
  const user = await StoreUser.findOne({ _id: id, is_deleted: false });
  if (!user) {
    const err = new Error("Store user not found");
    err.status = 404;
    err.reason = "NOT_FOUND";
    throw err;
  }
  return user;
};

const update = async (id, data) => {
  const user = await StoreUser.findOneAndUpdate({ _id: id, is_deleted: false }, data, { new: true });
  if (!user) {
    const err = new Error("Store user not found");
    err.status = 404;
    err.reason = "NOT_FOUND";
    throw err;
  }
  return user;
};

const updateStatus = async (id, data) => {
  const user = await StoreUser.findOneAndUpdate({ _id: id, is_deleted: false }, data, { new: true });
  if (!user) {
    const err = new Error("Store user not found");
    err.status = 404;
    err.reason = "NOT_FOUND";
    throw err;
  }
  return user;
};

const softDelete = async (id) => {
  const user = await StoreUser.findOneAndUpdate(
    { _id: id, is_deleted: false },
    { is_deleted: true, deleted_at: new Date() },
    { new: true }
  );
  if (!user) {
    const err = new Error("Store user not found");
    err.status = 404;
    err.reason = "NOT_FOUND";
    throw err;
  }
  return user;
};

const getByStoreId = async (storeId, { page, limit }) => {
  const filter = { store_id: storeId, is_deleted: false };
  return await paginate(StoreUser, filter, { page, limit });
};

module.exports = { create, getAll, getById, update, updateStatus, softDelete, getByStoreId };
