const service = require("../services/order-status-history.service");
const { sendSuccess } = require("../utils/response");

const create = async (req, res, next) => {
  try { return sendSuccess(res, { status: 201, message: "Status history recorded", data: await service.create(req.body) }); }
  catch (err) { next(err); }
};
const getAll = async (req, res, next) => {
  try { const { data, meta } = await service.getAll(req.query); return sendSuccess(res, { message: "Status history fetched", data, meta }); }
  catch (err) { next(err); }
};
const getById = async (req, res, next) => {
  try { return sendSuccess(res, { message: "History record fetched", data: await service.getById(req.params.id) }); }
  catch (err) { next(err); }
};

module.exports = { create, getAll, getById };
