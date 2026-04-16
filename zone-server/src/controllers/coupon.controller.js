const service = require("../services/coupon.service");
const { sendSuccess } = require("../utils/response");

const create = async (req, res, next) => {
  try { return sendSuccess(res, { status: 201, message: "Coupon created successfully", data: await service.create(req.body) }); }
  catch (err) { next(err); }
};
const getAll = async (req, res, next) => {
  try { const { data, meta } = await service.getAll(req.query); return sendSuccess(res, { message: "Coupons fetched", data, meta }); }
  catch (err) { next(err); }
};
const getPublic = async (req, res, next) => {
  try { const { data, meta } = await service.getPublic(req.query); return sendSuccess(res, { message: "Public coupons fetched", data, meta }); }
  catch (err) { next(err); }
};
const getByCode = async (req, res, next) => {
  try { return sendSuccess(res, { message: "Coupon fetched", data: await service.getByCode(req.params.code) }); }
  catch (err) { next(err); }
};
const getById = async (req, res, next) => {
  try { return sendSuccess(res, { message: "Coupon fetched", data: await service.getById(req.params.id) }); }
  catch (err) { next(err); }
};
const update = async (req, res, next) => {
  try { return sendSuccess(res, { message: "Coupon updated", data: await service.update(req.params.id, req.body) }); }
  catch (err) { next(err); }
};
const softDelete = async (req, res, next) => {
  try { return sendSuccess(res, { message: "Coupon deleted", data: await service.softDelete(req.params.id, req.user?.id) }); }
  catch (err) { next(err); }
};
const updateStatus = async (req, res, next) => {
  try { return sendSuccess(res, { message: "Coupon status updated", data: await service.updateStatus(req.params.id, req.body.is_active) }); }
  catch (err) { next(err); }
};
const validate = async (req, res, next) => {
  try { return sendSuccess(res, { message: "Coupon is valid", data: await service.validate(req.params.id, req.body) }); }
  catch (err) { next(err); }
};

module.exports = { create, getAll, getPublic, getByCode, getById, update, softDelete, updateStatus, validate };
