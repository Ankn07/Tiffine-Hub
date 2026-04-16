const service = require("../services/zone.service");
const { sendSuccess } = require("../utils/response");

const create = async (req, res, next) => {
  try {
    const data = await service.create(req.body);
    return sendSuccess(res, { status: 201, message: "Zone created successfully", data });
  } catch (err) { next(err); }
};

const getAll = async (req, res, next) => {
  try {
    const { data, meta } = await service.getAll(req.query);
    return sendSuccess(res, { message: "Zones fetched successfully", data, meta });
  } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    const data = await service.getById(req.params.id);
    return sendSuccess(res, { message: "Zone fetched successfully", data });
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const data = await service.update(req.params.id, req.body);
    return sendSuccess(res, { message: "Zone updated successfully", data });
  } catch (err) { next(err); }
};

const softDelete = async (req, res, next) => {
  try {
    const data = await service.softDelete(req.params.id);
    return sendSuccess(res, { message: "Zone deleted successfully", data });
  } catch (err) { next(err); }
};

const removePinCode = async (req, res, next) => {
  try {
    const { zone_id, pin_code } = req.body;
    const data = await service.removePinCode(zone_id, pin_code);
    return sendSuccess(res, { message: "Pin code removed from zone successfully", data });
  } catch (err) { next(err); }
};

const addPinCode = async (req, res, next) => {
  try {
    const { zone_id, post_office, pin_code } = req.body;
    const data = await service.addPinCode(zone_id, { post_office, pin_code });
    return sendSuccess(res, { message: "Pin code added to zone successfully", data });
  } catch (err) { next(err); }
};

const removeBulkPinCodes = async (req, res, next) => {
  try {
    const { zone_id, pin_codes } = req.body;
    const data = await service.removeBulkPinCodes(zone_id, pin_codes);
    return sendSuccess(res, { message: "Bulk pin codes removed from zone successfully", data });
  } catch (err) { next(err); }
};

const addBulkPinCodes = async (req, res, next) => {
  try {
    const { zone_id, zone } = req.body;
    const data = await service.addBulkPinCodes(zone_id, zone);
    return sendSuccess(res, { message: "Bulk pin codes added to zone successfully", data });
  } catch (err) { next(err); }
};

module.exports = { create, getAll, getById, update, softDelete, removePinCode, addPinCode, removeBulkPinCodes, addBulkPinCodes };
