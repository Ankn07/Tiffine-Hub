const service = require("../services/order-delivery.service");
const { sendSuccess } = require("../utils/response");

const create = async (req, res, next) => {
  try { return sendSuccess(res, { status: 201, message: "Delivery assigned successfully", data: await service.create(req.body) }); }
  catch (err) { next(err); }
};
const getAll = async (req, res, next) => {
  try { const { data, meta } = await service.getAll(req.query); return sendSuccess(res, { message: "Deliveries fetched", data, meta }); }
  catch (err) { next(err); }
};
const getById = async (req, res, next) => {
  try { return sendSuccess(res, { message: "Delivery fetched", data: await service.getById(req.params.id) }); }
  catch (err) { next(err); }
};
const update = async (req, res, next) => {
  try { return sendSuccess(res, { message: "Delivery updated", data: await service.update(req.params.id, req.body) }); }
  catch (err) { next(err); }
};
const remove = async (req, res, next) => {
  try { return sendSuccess(res, { message: "Delivery deleted", data: await service.remove(req.params.id) }); }
  catch (err) { next(err); }
};

module.exports = { create, getAll, getById, update, remove };
