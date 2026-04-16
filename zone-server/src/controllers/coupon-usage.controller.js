const service = require("../services/coupon-usage.service");
const { sendSuccess } = require("../utils/response");

const create = async (req, res, next) => {
  try { return sendSuccess(res, { status: 201, message: "Coupon usage recorded", data: await service.create(req.body) }); }
  catch (err) { next(err); }
};
const getAll = async (req, res, next) => {
  try { const { data, meta } = await service.getAll(req.query); return sendSuccess(res, { message: "Coupon usages fetched", data, meta }); }
  catch (err) { next(err); }
};
const getById = async (req, res, next) => {
  try { return sendSuccess(res, { message: "Coupon usage fetched", data: await service.getById(req.params.id) }); }
  catch (err) { next(err); }
};
const getByCustomer = async (req, res, next) => {
  try { const { data, meta } = await service.getByCustomer(req.params.customerId, req.query); return sendSuccess(res, { message: "Coupon usages fetched", data, meta }); }
  catch (err) { next(err); }
};
const getByCoupon = async (req, res, next) => {
  try { const { data, meta } = await service.getByCoupon(req.params.couponId, req.query); return sendSuccess(res, { message: "Coupon usages fetched", data, meta }); }
  catch (err) { next(err); }
};

module.exports = { create, getAll, getById, getByCustomer, getByCoupon };
