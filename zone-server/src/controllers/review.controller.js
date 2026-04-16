const service = require("../services/review.service");
const { sendSuccess } = require("../utils/response");

const create = async (req, res, next) => {
  try { return sendSuccess(res, { status: 201, message: "Review submitted successfully", data: await service.create(req.body) }); }
  catch (err) { next(err); }
};
const getAll = async (req, res, next) => {
  try { const { data, meta } = await service.getAll(req.query); return sendSuccess(res, { message: "Reviews fetched", data, meta }); }
  catch (err) { next(err); }
};
const getById = async (req, res, next) => {
  try { return sendSuccess(res, { message: "Review fetched", data: await service.getById(req.params.id) }); }
  catch (err) { next(err); }
};
const update = async (req, res, next) => {
  try { return sendSuccess(res, { message: "Review updated", data: await service.update(req.params.id, req.body) }); }
  catch (err) { next(err); }
};
const softDelete = async (req, res, next) => {
  try { return sendSuccess(res, { message: "Review deleted", data: await service.softDelete(req.params.id, req.user?.id) }); }
  catch (err) { next(err); }
};
const getByCustomer = async (req, res, next) => {
  try { const { data, meta } = await service.getByCustomer(req.params.customerId, req.query); return sendSuccess(res, { message: "Reviews fetched", data, meta }); }
  catch (err) { next(err); }
};
const getByProduct = async (req, res, next) => {
  try { const { data, meta } = await service.getByProduct(req.params.productId, req.query); return sendSuccess(res, { message: "Reviews fetched", data, meta }); }
  catch (err) { next(err); }
};
const getByOrder = async (req, res, next) => {
  try { const { data, meta } = await service.getByOrder(req.params.orderId, req.query); return sendSuccess(res, { message: "Reviews fetched", data, meta }); }
  catch (err) { next(err); }
};

module.exports = { create, getAll, getById, update, softDelete, getByCustomer, getByProduct, getByOrder };
