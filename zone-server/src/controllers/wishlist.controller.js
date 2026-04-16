const service = require("../services/wishlist.service");
const { sendSuccess } = require("../utils/response");

const addItem = async (req, res, next) => {
  try { return sendSuccess(res, { message: "Item added to wishlist", data: await service.addItem(req.body) }); }
  catch (err) { next(err); }
};
const getAll = async (req, res, next) => {
  try { const { data, meta } = await service.getAll(req.query); return sendSuccess(res, { message: "Wishlists fetched", data, meta }); }
  catch (err) { next(err); }
};
const getByCustomer = async (req, res, next) => {
  try { return sendSuccess(res, { message: "Wishlist fetched", data: await service.getByCustomer(req.params.customerId) }); }
  catch (err) { next(err); }
};
const replaceItems = async (req, res, next) => {
  try { return sendSuccess(res, { message: "Wishlist updated", data: await service.replaceItems(req.params.id, req.body) }); }
  catch (err) { next(err); }
};
const removeItem = async (req, res, next) => {
  try { return sendSuccess(res, { message: "Item removed from wishlist", data: await service.removeItem(req.params.id, req.body) }); }
  catch (err) { next(err); }
};
const toggleItem = async (req, res, next) => {
  try { return sendSuccess(res, { message: "Wishlist item toggled", data: await service.toggleItem(req.params.id, req.body) }); }
  catch (err) { next(err); }
};

module.exports = { addItem, getAll, getByCustomer, replaceItems, removeItem, toggleItem };
