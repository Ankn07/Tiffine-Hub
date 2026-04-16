const service = require("../services/store-user.service");
const { sendSuccess } = require("../utils/response");

const create = async (req, res, next) => {
  try {
    const data = await service.create(req.body);
    return sendSuccess(res, { status: 201, message: "Store user created and assigned successfully", data });
  } catch (err) { next(err); }
};

const getAll = async (req, res, next) => {
  try {
    const { data, meta } = await service.getAll(req.query);
    return sendSuccess(res, { message: "Store users fetched successfully", data, meta });
  } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    const data = await service.getById(req.params.id);
    return sendSuccess(res, { message: "Store user fetched successfully", data });
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const data = await service.update(req.params.id, req.body);
    return sendSuccess(res, { message: "Store user updated successfully", data });
  } catch (err) { next(err); }
};

const updateStatus = async (req, res, next) => {
  try {
    const data = await service.updateStatus(req.params.id, req.body);
    return sendSuccess(res, { message: "Store user status updated successfully", data });
  } catch (err) { next(err); }
};

const softDelete = async (req, res, next) => {
  try {
    const data = await service.softDelete(req.params.id);
    return sendSuccess(res, { message: "Store user moved to bin successfully", data });
  } catch (err) { next(err); }
};

const getByStoreId = async (req, res, next) => {
  try {
    const { data, meta } = await service.getByStoreId(req.params.storeId, req.query);
    return sendSuccess(res, { message: "Store users fetched successfully", data, meta });
  } catch (err) { next(err); }
};

module.exports = { create, getAll, getById, update, updateStatus, softDelete, getByStoreId };
