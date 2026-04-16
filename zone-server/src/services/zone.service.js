const Zone = require("../models/zone.model");
const { paginate } = require("../utils/paginate");

const create = async (data) => {
  return await Zone.create(data);
};

const getAll = async ({ page, limit, search, operator_id }) => {
  const filter = { is_deleted: false };
  if (search) {
    filter.$or = [
      { zone_name: { $regex: search, $options: "i" } },
      { area: { $regex: search, $options: "i" } },
    ];
  }
  if (operator_id) filter.operator_id = operator_id;
  return await paginate(Zone, filter, { page, limit });
};

const getById = async (id) => {
  const zone = await Zone.findOne({ _id: id, is_deleted: false });
  if (!zone) {
    const err = new Error("Zone not found");
    err.status = 404;
    err.reason = "NOT_FOUND";
    throw err;
  }
  return zone;
};

const update = async (id, data) => {
  const zone = await Zone.findOneAndUpdate({ _id: id, is_deleted: false }, data, { new: true });
  if (!zone) {
    const err = new Error("Zone not found");
    err.status = 404;
    err.reason = "NOT_FOUND";
    throw err;
  }
  return zone;
};

const softDelete = async (id) => {
  const zone = await Zone.findOneAndUpdate(
    { _id: id, is_deleted: false },
    { is_deleted: true, deleted_at: new Date() },
    { new: true }
  );
  if (!zone) {
    const err = new Error("Zone not found");
    err.status = 404;
    err.reason = "NOT_FOUND";
    throw err;
  }
  return zone;
};

const removePinCode = async (zone_id, pin_code) => {
  const zone = await Zone.findOneAndUpdate(
    { _id: zone_id, is_deleted: false },
    { $pull: { zone: { pin_code } } },
    { new: true }
  );
  if (!zone) {
    const err = new Error("Zone not found");
    err.status = 404;
    err.reason = "NOT_FOUND";
    throw err;
  }
  return zone;
};

const addPinCode = async (zone_id, entry) => {
  const zone = await Zone.findOneAndUpdate(
    { _id: zone_id, is_deleted: false },
    { $addToSet: { zone: entry } },
    { new: true }
  );
  if (!zone) {
    const err = new Error("Zone not found");
    err.status = 404;
    err.reason = "NOT_FOUND";
    throw err;
  }
  return zone;
};

const removeBulkPinCodes = async (zone_id, pin_codes) => {
  const zone = await Zone.findOneAndUpdate(
    { _id: zone_id, is_deleted: false },
    { $pull: { zone: { pin_code: { $in: pin_codes } } } },
    { new: true }
  );
  if (!zone) {
    const err = new Error("Zone not found");
    err.status = 404;
    err.reason = "NOT_FOUND";
    throw err;
  }
  return zone;
};

const addBulkPinCodes = async (zone_id, entries) => {
  const zone = await Zone.findOneAndUpdate(
    { _id: zone_id, is_deleted: false },
    { $push: { zone: { $each: entries } } },
    { new: true }
  );
  if (!zone) {
    const err = new Error("Zone not found");
    err.status = 404;
    err.reason = "NOT_FOUND";
    throw err;
  }
  return zone;
};

module.exports = { create, getAll, getById, update, softDelete, removePinCode, addPinCode, removeBulkPinCodes, addBulkPinCodes };
