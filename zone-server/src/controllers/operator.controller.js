const operatorService = require("../services/operator.service");
const { sendSuccess } = require("../utils/response");

const create = async (req, res, next) => {
  try {
    const data = await operatorService.create(req.body);
    return sendSuccess(res, { status: 201, message: "Operator created successfully", data });
  } catch (err) { next(err); }
};

const getAll = async (req, res, next) => {
  try {
    const { data, meta } = await operatorService.getAll(req.query);
    return sendSuccess(res, { message: "Operators fetched successfully", data, meta });
  } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    const data = await operatorService.getById(req.params.id);
    return sendSuccess(res, { message: "Operator fetched successfully", data });
  } catch (err) { next(err); }
};

const updateStatus = async (req, res, next) => {
  try {
    const data = await operatorService.updateStatus(req.params.id, req.body);
    return sendSuccess(res, { message: "Operator status updated successfully", data });
  } catch (err) { next(err); }
};

const softDelete = async (req, res, next) => {
  try {
    const data = await operatorService.softDelete(req.params.id);
    return sendSuccess(res, { message: "Operator moved to bin successfully", data });
  } catch (err) { next(err); }
};

const assignZoneAndPerson = async (req, res, next) => {
  try {
    const data = await operatorService.assignZoneAndPerson(req.params.id, req.body);
    return sendSuccess(res, { message: "Operator assignments updated successfully", data });
  } catch (err) { next(err); }
};

module.exports = { create, getAll, getById, updateStatus, softDelete, assignZoneAndPerson };
