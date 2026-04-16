const service = require("../services/product-category.service");
const { sendSuccess } = require("../utils/response");

const create = async (req, res, next) => {
  try {
    const data = await service.create(req.body);
    return sendSuccess(res, { status: 201, message: "Product category created successfully", data });
  } catch (err) { next(err); }
};

const getAll = async (req, res, next) => {
  try {
    const { data, meta } = await service.getAll(req.query);
    return sendSuccess(res, { message: "Product categories fetched successfully", data, meta });
  } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    const data = await service.getById(req.params.id);
    return sendSuccess(res, { message: "Product category fetched successfully", data });
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const data = await service.update(req.params.id, req.body);
    return sendSuccess(res, { message: "Product category updated successfully", data });
  } catch (err) { next(err); }
};

const softDelete = async (req, res, next) => {
  try {
    const data = await service.softDelete(req.params.id);
    return sendSuccess(res, { message: "Product category moved to bin successfully", data });
  } catch (err) { next(err); }
};

module.exports = { create, getAll, getById, update, softDelete };
