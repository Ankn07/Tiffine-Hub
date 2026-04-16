const OrderStatusHistory = require("../models/order-status-history.model");
const { paginate } = require("../utils/paginate");

const _throw = (msg, status, reason) => { const e = new Error(msg); e.status = status; e.reason = reason; throw e; };

const create = async (data) => OrderStatusHistory.create(data);

const getAll = async ({ page, limit, order_id }) => {
  const filter = {};
  if (order_id) filter.order_id = order_id;
  return paginate(OrderStatusHistory, filter, { page, limit, sort: { created_at: 1 } });
};

const getById = async (id) => {
  const h = await OrderStatusHistory.findById(id);
  if (!h) _throw("History record not found", 404, "NOT_FOUND");
  return h;
};

module.exports = { create, getAll, getById };
