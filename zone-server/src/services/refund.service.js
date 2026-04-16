const Refund = require("../models/refund.model");
const Order = require("../models/order.model");
const Payment = require("../models/payment.model");
const { paginate } = require("../utils/paginate");

const _throw = (msg, status, reason) => { const e = new Error(msg); e.status = status; e.reason = reason; throw e; };

const create = async (data) => {
  const order = await Order.findOne({ _id: data.order_id, is_deleted: false });
  if (!order) _throw("Order not found", 404, "NOT_FOUND");
  return Refund.create(data);
};

const getAll = async ({ page, limit, status }) => {
  const filter = {};
  if (status) filter.status = status;
  return paginate(Refund, filter, { page, limit });
};

const getById = async (id) => {
  const r = await Refund.findById(id).populate("order_id", "order_no total").populate("payment_id", "amount upi_txn_id");
  if (!r) _throw("Refund not found", 404, "NOT_FOUND");
  return r;
};

const updateStatus = async (id, { status, note }, processed_by) => {
  const refund = await Refund.findById(id);
  if (!refund) _throw("Refund not found", 404, "NOT_FOUND");
  if (refund.status !== "PENDING") _throw("Refund is no longer pending", 400, "INVALID_STATUS");

  refund.status = status;
  refund.note = note || refund.note;
  refund.processed_by = processed_by;

  if (status === "APPROVED") {
    refund.processed_at = new Date();
    await Order.findByIdAndUpdate(refund.order_id, { payment_status: "REFUNDED", status: "REFUNDED" });
    await Payment.findByIdAndUpdate(refund.payment_id, { status: "REFUNDED" });
  } else if (status === "REJECTED") {
    refund.rejected_at = new Date();
  }

  await refund.save();
  return refund;
};

const getByStatus = async ({ status, page, limit }) => {
  const filter = status ? { status } : {};
  return paginate(Refund, filter, { page, limit });
};

const getByOrder = async (orderId, { page, limit }) =>
  paginate(Refund, { order_id: orderId }, { page, limit });

const getByPayment = async (paymentId, { page, limit }) =>
  paginate(Refund, { payment_id: paymentId }, { page, limit });

module.exports = { create, getAll, getById, updateStatus, getByStatus, getByOrder, getByPayment };
