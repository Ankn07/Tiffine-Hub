const Order = require("../models/order.model");
const OrderStatusHistory = require("../models/order-status-history.model");
const { paginate } = require("../utils/paginate");

const _throw = (msg, status, reason) => { const e = new Error(msg); e.status = status; e.reason = reason; throw e; };

const _recordHistory = async (order_id, status, note, changed_by) => {
  await OrderStatusHistory.create({ order_id, status, note, changed_by });
};

const create = async (data, userId) => {
  const subtotal = data.items.reduce((s, i) => s + i.unit_price * i.quantity, 0);
  const discount = data.discount || 0;
  const total = Math.max(0, subtotal - discount + (data.delivery_charge || 0) + (data.tax || 0));

  const items = data.items.map((i) => ({
    ...i,
    name: i.name || "Product",
    sku: i.sku || "SKU",
    total_price: i.unit_price * i.quantity,
  }));

  const order = await Order.create({ ...data, items, subtotal, total });
  await _recordHistory(order._id, "PENDING", "Order placed", userId || data.customer_id);
  return order;
};

const getAll = async ({ page, limit, status, store_id, customer_id, payment_status }) => {
  const filter = { is_deleted: false };
  if (status) filter.status = status;
  if (store_id) filter.store_id = store_id;
  if (customer_id) filter.customer_id = customer_id;
  if (payment_status) filter.payment_status = payment_status;
  return paginate(Order, filter, { page, limit });
};

const getById = async (id) => {
  const o = await Order.findOne({ _id: id, is_deleted: false });
  if (!o) _throw("Order not found", 404, "NOT_FOUND");
  return o;
};

const getByOrderNo = async (orderNo) => {
  const o = await Order.findOne({ order_no: orderNo, is_deleted: false });
  if (!o) _throw("Order not found", 404, "NOT_FOUND");
  return o;
};

const update = async (id, data) => {
  const o = await Order.findOneAndUpdate({ _id: id, is_deleted: false }, data, { new: true });
  if (!o) _throw("Order not found", 404, "NOT_FOUND");
  return o;
};

const softDelete = async (id, deleted_by) => {
  const o = await Order.findOneAndUpdate({ _id: id, is_deleted: false }, { is_deleted: true, deleted_at: new Date(), deleted_by }, { new: true });
  if (!o) _throw("Order not found", 404, "NOT_FOUND");
  return o;
};

const _transition = async (id, from, to, note, changed_by) => {
  const order = await Order.findOne({ _id: id, is_deleted: false });
  if (!order) _throw("Order not found", 404, "NOT_FOUND");
  if (!from.includes(order.status)) _throw(`Cannot transition from ${order.status} to ${to}`, 400, "INVALID_STATUS_TRANSITION");
  order.status = to;
  await order.save();
  await _recordHistory(order._id, to, note, changed_by);
  return order;
};

const cancel = async (id, { reason }, userId) =>
  _transition(id, ["PENDING", "CONFIRMED"], "CANCELLED", reason || "Cancelled", userId);

const confirm = async (id, { note }, userId) =>
  _transition(id, ["PENDING"], "CONFIRMED", note || "Confirmed by store", userId);

const pack = async (id, { note }, userId) =>
  _transition(id, ["CONFIRMED"], "PACKED", note || "Order packed", userId);

const deliver = async (id, { note }, userId) =>
  _transition(id, ["PACKED"], "OUT_FOR_DELIVERY", note || "Out for delivery", userId);

const getByCustomer = async (customerId, { page, limit, status }) => {
  const filter = { customer_id: customerId, is_deleted: false };
  if (status) filter.status = status;
  return paginate(Order, filter, { page, limit });
};

const getByStore = async (storeId, { page, limit, status }) => {
  const filter = { store_id: storeId, is_deleted: false };
  if (status) filter.status = status;
  return paginate(Order, filter, { page, limit });
};

const getStatusHistory = async (id) => {
  const history = await OrderStatusHistory.find({ order_id: id }).sort({ created_at: 1 });
  return { data: history, meta: {} };
};

const getItems = async (id) => {
  const order = await Order.findOne({ _id: id, is_deleted: false }).select("items order_no");
  if (!order) _throw("Order not found", 404, "NOT_FOUND");
  return order;
};

const getPayment = async (id) => {
  const Payment = require("../models/payment.model");
  const payment = await Payment.findOne({ order_id: id });
  if (!payment) _throw("Payment not found for this order", 404, "NOT_FOUND");
  return payment;
};

const getDelivery = async (id) => {
  const OrderDelivery = require("../models/order-delivery.model");
  const delivery = await OrderDelivery.findOne({ order_id: id });
  if (!delivery) _throw("Delivery record not found for this order", 404, "NOT_FOUND");
  return delivery;
};

module.exports = { create, getAll, getById, getByOrderNo, update, softDelete, cancel, confirm, pack, deliver, getByCustomer, getByStore, getStatusHistory, getItems, getPayment, getDelivery };
