const Operator = require("../models/operator.model");
const { paginate } = require("../utils/paginate");

const create = async (data) => {
  const existing = await Operator.findOne({ email: data.email, is_deleted: false });
  if (existing) {
    const err = new Error("An operator with this email already exists");
    err.status = 409;
    err.reason = "DUPLICATE_EMAIL";
    throw err;
  }
  return await Operator.create(data);
};

const getAll = async ({ page, limit, search, status }) => {
  const filter = { is_deleted: false };
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }
  if (typeof status !== "undefined") {
    filter.is_active = status === "true" || status === true;
  }
  return await paginate(Operator, filter, { page, limit });
};

const getById = async (id) => {
  const operator = await Operator.findOne({ _id: id, is_deleted: false });
  if (!operator) {
    const err = new Error("Operator not found");
    err.status = 404;
    err.reason = "NOT_FOUND";
    throw err;
  }
  return operator;
};

const updateStatus = async (id, data) => {
  const operator = await Operator.findOneAndUpdate(
    { _id: id, is_deleted: false },
    { is_active: data.is_active, updated_by: data.updated_by },
    { new: true }
  );
  if (!operator) {
    const err = new Error("Operator not found");
    err.status = 404;
    err.reason = "NOT_FOUND";
    throw err;
  }
  return operator;
};

const softDelete = async (id) => {
  const operator = await Operator.findOneAndUpdate(
    { _id: id, is_deleted: false },
    { is_deleted: true, deleted_at: new Date() },
    { new: true }
  );
  if (!operator) {
    const err = new Error("Operator not found");
    err.status = 404;
    err.reason = "NOT_FOUND";
    throw err;
  }
  return operator;
};

const assignZoneAndPerson = async (id, data) => {
  const operator = await Operator.findOneAndUpdate(
    { _id: id, is_deleted: false },
    { ...data },
    { new: true }
  );
  if (!operator) {
    const err = new Error("Operator not found");
    err.status = 404;
    err.reason = "NOT_FOUND";
    throw err;
  }
  return operator;
};

module.exports = { create, getAll, getById, updateStatus, softDelete, assignZoneAndPerson };
