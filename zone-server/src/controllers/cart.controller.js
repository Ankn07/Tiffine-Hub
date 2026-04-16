const service = require("../services/cart.service");
const { sendSuccess } = require("../utils/response");

const addItem = async (req, res, next) => {
  try { return sendSuccess(res, { status: 200, message: "Item added to cart", data: await service.addItem(req.body) }); }
  catch (err) { next(err); }
};
const getAll = async (req, res, next) => {
  try { const { data, meta } = await service.getAll(req.query); return sendSuccess(res, { message: "Carts fetched", data, meta }); }
  catch (err) { next(err); }
};
const getByCustomer = async (req, res, next) => {
  try { return sendSuccess(res, { message: "Cart fetched", data: await service.getByCustomer(req.params.customerId) }); }
  catch (err) { next(err); }
};
const replaceCart = async (req, res, next) => {
  try { return sendSuccess(res, { message: "Cart updated", data: await service.replaceCart(req.params.id, req.body) }); }
  catch (err) { next(err); }
};
const removeItem = async (req, res, next) => {
  try { return sendSuccess(res, { message: "Item removed from cart", data: await service.removeItem(req.params.id, req.body) }); }
  catch (err) { next(err); }
};
const updateQuantity = async (req, res, next) => {
  try { return sendSuccess(res, { message: "Cart quantity updated", data: await service.updateQuantity(req.params.id, req.body) }); }
  catch (err) { next(err); }
};

module.exports = { addItem, getAll, getByCustomer, replaceCart, removeItem, updateQuantity };
