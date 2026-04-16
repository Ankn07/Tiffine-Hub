const service = require("../services/authorized-person.service");
const { sendSuccess } = require("../utils/response");

const create = async (req, res, next) => {
  try {
    const data = await service.create(req.body);
    return sendSuccess(res, { status: 201, message: "Authorized person created successfully", data });
  } catch (err) { next(err); }
};

const getAll = async (req, res, next) => {
  try {
    const { data, meta } = await service.getAll(req.query);
    return sendSuccess(res, { message: "Authorized persons fetched successfully", data, meta });
  } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    const data = await service.getById(req.params.id);
    return sendSuccess(res, { message: "Authorized person fetched successfully", data });
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const data = await service.update(req.params.id, req.body);
    return sendSuccess(res, { message: "Authorized person updated successfully", data });
  } catch (err) { next(err); }
};

const softDelete = async (req, res, next) => {
  try {
    const data = await service.softDelete(req.params.id);
    return sendSuccess(res, { message: "Authorized person moved to bin successfully", data });
  } catch (err) { next(err); }
};

const getByOperatorId = async (req, res, next) => {
  try {
    const { data, meta } = await service.getByOperatorId(req.params.operatorId, req.query);
    return sendSuccess(res, { message: "Authorized persons fetched successfully", data, meta });
  } catch (err) { next(err); }
};

const sendOtp = async (req, res, next) => {
  try {
    const data = await service.sendOtp(req.body.email);
    return sendSuccess(res, { message: "OTP sent to your registered email address", data });
  } catch (err) { next(err); }
};

const verifyOtp = async (req, res, next) => {
  try {
    const data = await service.verifyOtp(req.body.email, req.body.otp);
    return sendSuccess(res, { message: "Login successful", data });
  } catch (err) { next(err); }
};

module.exports = { create, getAll, getById, update, softDelete, getByOperatorId, sendOtp, verifyOtp };
