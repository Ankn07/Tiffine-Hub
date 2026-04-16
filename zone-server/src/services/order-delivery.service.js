const OrderDelivery = require("../models/order-delivery.model");
const Order = require("../models/order.model");
const { paginate } = require("../utils/paginate");

const _throw = (msg, status, reason) => { const e = new Error(msg); e.status = status; e.reason = reason; throw e; };

const create = async (data) => {
  const order = await Order.findOne({ _id: data.order_id, is_deleted: false });
  if (!order) _throw("Order not found", 404, "NOT_FOUND");
  const delivery = await OrderDelivery.create(data);
  await Order.findByIdAndUpdate(data.order_id, { delivery_id: delivery._id.toString() });
  return delivery;
};

const getAll = async ({ page, limit, status }) => {
  const filter = {};
  if (status) filter.status = status;
  return paginate(OrderDelivery, filter, { page, limit });
};

const getById = async (id) => {
  const d = await OrderDelivery.findById(id).populate("order_id", "order_no status customer_id");
  if (!d) _throw("Delivery not found", 404, "NOT_FOUND");
  return d;
};

const update = async (id, data) => {
  const d = await OrderDelivery.findByIdAndUpdate(id, data, { new: true });
  if (!d) _throw("Delivery not found", 404, "NOT_FOUND");

  // Sync order status when delivery is marked DELIVERED
  if (data.status === "DELIVERED") {
    await Order.findByIdAndUpdate(d.order_id, { status: "DELIVERED" });
    if (!data.delivered_at) d.delivered_at = new Date();
  }
  return d;
};

const remove = async (id) => {
  const d = await OrderDelivery.findByIdAndDelete(id);
  if (!d) _throw("Delivery not found", 404, "NOT_FOUND");
  return d;
};

module.exports = { create, getAll, getById, update, remove };
