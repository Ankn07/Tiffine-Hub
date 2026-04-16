const service = require("../services/payment.service");
const { sendSuccess } = require("../utils/response");

const create = async (req, res, next) => {
  try { return sendSuccess(res, { status: 201, message: "Payment created", data: await service.create(req.body) }); }
  catch (err) { next(err); }
};
const verify = async (req, res, next) => {
  try { return sendSuccess(res, { message: "Payment verified successfully", data: await service.verify(req.body) }); }
  catch (err) { next(err); }
};
const failure = async (req, res, next) => {
  try { return sendSuccess(res, { message: "Payment failure recorded", data: await service.failure(req.body) }); }
  catch (err) { next(err); }
};
const webhook = async (req, res, next) => {
  try { return sendSuccess(res, { message: "Webhook received", data: await service.webhook(req.body) }); }
  catch (err) { next(err); }
};
const getAll = async (req, res, next) => {
  try { const { data, meta } = await service.getAll(req.query); return sendSuccess(res, { message: "Payments fetched", data, meta }); }
  catch (err) { next(err); }
};

module.exports = { create, verify, failure, webhook, getAll };
