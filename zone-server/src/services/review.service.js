const Review = require("../models/review.model");
const { paginate } = require("../utils/paginate");

const _throw = (msg, status, reason) => { const e = new Error(msg); e.status = status; e.reason = reason; throw e; };

const create = async (data) => Review.create(data);

const getAll = async ({ page, limit, search }) => {
  const filter = { is_deleted: false };
  if (search) filter.comment = { $regex: search, $options: "i" };
  return paginate(Review, filter, { page, limit });
};

const getById = async (id) => {
  const r = await Review.findOne({ _id: id, is_deleted: false });
  if (!r) _throw("Review not found", 404, "NOT_FOUND");
  return r;
};

const update = async (id, data) => {
  const r = await Review.findOneAndUpdate({ _id: id, is_deleted: false }, data, { new: true });
  if (!r) _throw("Review not found", 404, "NOT_FOUND");
  return r;
};

const softDelete = async (id, deleted_by) => {
  const r = await Review.findOneAndUpdate({ _id: id, is_deleted: false }, { is_deleted: true, deleted_at: new Date(), deleted_by }, { new: true });
  if (!r) _throw("Review not found", 404, "NOT_FOUND");
  return r;
};

const getByCustomer = async (customerId, { page, limit }) =>
  paginate(Review, { customer_id: customerId, is_deleted: false }, { page, limit });

const getByProduct = async (productId, { page, limit, rating }) => {
  const filter = { product_id: productId, is_deleted: false };
  if (rating) filter.rating = Number(rating);
  return paginate(Review, filter, { page, limit });
};

const getByOrder = async (orderId, { page, limit }) =>
  paginate(Review, { order_id: orderId, is_deleted: false }, { page, limit });

module.exports = { create, getAll, getById, update, softDelete, getByCustomer, getByProduct, getByOrder };
