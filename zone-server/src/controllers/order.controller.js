const service = require("../services/order.service");
const { sendSuccess } = require("../utils/response");

const create = async (req, res, next) => {
  try { return sendSuccess(res, { status: 201, message: "Order placed successfully", data: await service.create(req.body, req.user?.id) }); }
  catch (err) { next(err); }
};
const getAll = async (req, res, next) => {
  try { const { data, meta } = await service.getAll(req.query); return sendSuccess(res, { message: "Orders fetched", data, meta }); }
  catch (err) { next(err); }
};
const getById = async (req, res, next) => {
  try { return sendSuccess(res, { message: "Order fetched", data: await service.getById(req.params.id) }); }
  catch (err) { next(err); }
};
const getByOrderNo = async (req, res, next) => {
  try { return sendSuccess(res, { message: "Order fetched", data: await service.getByOrderNo(req.params.orderNo) }); }
  catch (err) { next(err); }
};
const update = async (req, res, next) => {
  try { return sendSuccess(res, { message: "Order updated", data: await service.update(req.params.id, req.body) }); }
  catch (err) { next(err); }
};
const softDelete = async (req, res, next) => {
  try { return sendSuccess(res, { message: "Order deleted", data: await service.softDelete(req.params.id, req.user?.id) }); }
  catch (err) { next(err); }
};
const cancel = async (req, res, next) => {
  try { return sendSuccess(res, { message: "Order cancelled successfully", data: await service.cancel(req.params.id, req.body, req.user?.id) }); }
  catch (err) { next(err); }
};
const confirm = async (req, res, next) => {
  try { return sendSuccess(res, { message: "Order confirmed successfully", data: await service.confirm(req.params.id, req.body, req.user?.id) }); }
  catch (err) { next(err); }
};
const pack = async (req, res, next) => {
  try { return sendSuccess(res, { message: "Order marked as packed", data: await service.pack(req.params.id, req.body, req.user?.id) }); }
  catch (err) { next(err); }
};
const deliver = async (req, res, next) => {
  try { return sendSuccess(res, { message: "Order out for delivery", data: await service.deliver(req.params.id, req.body, req.user?.id) }); }
  catch (err) { next(err); }
};
const getByCustomer = async (req, res, next) => {
  try { const { data, meta } = await service.getByCustomer(req.params.customerId, req.query); return sendSuccess(res, { message: "Orders fetched", data, meta }); }
  catch (err) { next(err); }
};
const getByStore = async (req, res, next) => {
  try { const { data, meta } = await service.getByStore(req.params.storeId, req.query); return sendSuccess(res, { message: "Orders fetched", data, meta }); }
  catch (err) { next(err); }
};
const getStatusHistory = async (req, res, next) => {
  try { const { data, meta } = await service.getStatusHistory(req.params.id); return sendSuccess(res, { message: "Status history fetched", data, meta }); }
  catch (err) { next(err); }
};
const getItems = async (req, res, next) => {
  try { return sendSuccess(res, { message: "Order items fetched", data: await service.getItems(req.params.id) }); }
  catch (err) { next(err); }
};
const getPayment = async (req, res, next) => {
  try { return sendSuccess(res, { message: "Payment fetched", data: await service.getPayment(req.params.id) }); }
  catch (err) { next(err); }
};
const getDelivery = async (req, res, next) => {
  try { return sendSuccess(res, { message: "Delivery fetched", data: await service.getDelivery(req.params.id) }); }
  catch (err) { next(err); }
};

module.exports = { create, getAll, getById, getByOrderNo, update, softDelete, cancel, confirm, pack, deliver, getByCustomer, getByStore, getStatusHistory, getItems, getPayment, getDelivery };
