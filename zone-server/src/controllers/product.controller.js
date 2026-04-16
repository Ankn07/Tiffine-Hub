const service = require("../services/product.service");
const { sendSuccess } = require("../utils/response");

const create = async (req, res, next) => {
  try {
    const data = await service.create(req.body);
    return sendSuccess(res, { status: 201, message: "Product created successfully", data });
  } catch (err) { next(err); }
};

const getAll = async (req, res, next) => {
  try {
    const { data, meta } = await service.getAll(req.query);
    return sendSuccess(res, { message: "Products fetched successfully", data, meta });
  } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    const data = await service.getById(req.params.id);
    return sendSuccess(res, { message: "Product fetched successfully", data });
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const data = await service.update(req.params.id, req.body);
    return sendSuccess(res, { message: "Product updated successfully", data });
  } catch (err) { next(err); }
};

const updateStock = async (req, res, next) => {
  try {
    const data = await service.updateStock(req.params.id, req.body.stock);
    return sendSuccess(res, { message: "Product stock updated successfully", data });
  } catch (err) { next(err); }
};

const softDelete = async (req, res, next) => {
  try {
    const data = await service.softDelete(req.params.id);
    return sendSuccess(res, { message: "Product moved to bin successfully", data });
  } catch (err) { next(err); }
};

const getByStoreId = async (req, res, next) => {
  try {
    const { data, meta } = await service.getByStoreId(req.params.storesId, req.query);
    return sendSuccess(res, { message: "Products fetched successfully for the store", data, meta });
  } catch (err) { next(err); }
};

module.exports = { create, getAll, getById, update, updateStock, softDelete, getByStoreId };
