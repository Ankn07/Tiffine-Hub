const service = require("../services/refund.service");
const { sendSuccess } = require("../utils/response");

const create = async (req, res, next) => {
  try { return sendSuccess(res, { status: 201, message: "Refund request submitted", data: await service.create(req.body) }); }
  catch (err) { next(err); }
};
const getAll = async (req, res, next) => {
  try { const { data, meta } = await service.getAll(req.query); return sendSuccess(res, { message: "Refunds fetched", data, meta }); }
  catch (err) { next(err); }
};
const getById = async (req, res, next) => {
  try { return sendSuccess(res, { message: "Refund fetched", data: await service.getById(req.params.id) }); }
  catch (err) { next(err); }
};
const updateStatus = async (req, res, next) => {
  try { return sendSuccess(res, { message: `Refund ${req.body.status.toLowerCase()} successfully`, data: await service.updateStatus(req.params.id, req.body, req.user?.id) }); }
  catch (err) { next(err); }
};
const getByStatus = async (req, res, next) => {
  try { const { data, meta } = await service.getByStatus(req.query); return sendSuccess(res, { message: "Refunds fetched", data, meta }); }
  catch (err) { next(err); }
};
const getByOrder = async (req, res, next) => {
  try { const { data, meta } = await service.getByOrder(req.params.id, req.query); return sendSuccess(res, { message: "Refunds fetched", data, meta }); }
  catch (err) { next(err); }
};
const getByPayment = async (req, res, next) => {
  try { const { data, meta } = await service.getByPayment(req.params.id, req.query); return sendSuccess(res, { message: "Refunds fetched", data, meta }); }
  catch (err) { next(err); }
};

module.exports = { create, getAll, getById, updateStatus, getByStatus, getByOrder, getByPayment };
