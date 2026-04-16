const service = require("../services/store.service");
const { sendSuccess } = require("../utils/response");

const create = async (req, res, next) => {
  try {
    const data = await service.create(req.body);
    return sendSuccess(res, { status: 201, message: "Store created successfully", data });
  } catch (err) { next(err); }
};

const getAll = async (req, res, next) => {
  try {
    const { data, meta } = await service.getAll(req.query);
    return sendSuccess(res, { message: "Stores fetched successfully", data, meta });
  } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    const data = await service.getById(req.params.id);
    return sendSuccess(res, { message: "Store fetched successfully", data });
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const data = await service.update(req.params.id, req.body);
    return sendSuccess(res, { message: "Store updated successfully", data });
  } catch (err) { next(err); }
};

const updateStatus = async (req, res, next) => {
  try {
    const data = await service.updateStatus(req.params.id, req.body);
    return sendSuccess(res, { message: "Store status updated successfully", data });
  } catch (err) { next(err); }
};

const softDelete = async (req, res, next) => {
  try {
    const data = await service.softDelete(req.params.id);
    return sendSuccess(res, { message: "Store moved to bin successfully", data });
  } catch (err) { next(err); }
};

const getByPinCode = async (req, res, next) => {
  try {
    const { data, meta } = await service.getByPinCode(req.params["pin-code"], req.query);
    return sendSuccess(res, { message: `Stores fetched successfully for pin code ${req.params["pin-code"]}`, data, meta });
  } catch (err) { next(err); }
};

module.exports = { create, getAll, getById, update, updateStatus, softDelete, getByPinCode };
