const Payment = require("../models/payment.model");
const Order = require("../models/order.model");
const { paginate } = require("../utils/paginate");

const _throw = (msg, status, reason) => { const e = new Error(msg); e.status = status; e.reason = reason; throw e; };

const create = async (data) => {
  const order = await Order.findOne({ _id: data.order_id, is_deleted: false });
  if (!order) _throw("Order not found", 404, "NOT_FOUND");
  const payment = await Payment.create(data);
  return payment;
};

const verify = async ({ payment_id, upi_txn_id, upi_ref_id, gateway_response }) => {
  const payment = await Payment.findById(payment_id);
  if (!payment) _throw("Payment not found", 404, "NOT_FOUND");
  if (payment.status === "SUCCESS") _throw("Payment already verified", 400, "ALREADY_VERIFIED");

  payment.status = "SUCCESS";
  payment.upi_txn_id = upi_txn_id;
  payment.upi_ref_id = upi_ref_id || null;
  payment.gateway_response = gateway_response || null;
  payment.paid_at = new Date();
  await payment.save();

  await Order.findByIdAndUpdate(payment.order_id, { payment_status: "PAID", payment_id: payment._id.toString() });
  return payment;
};

const failure = async ({ payment_id, reason, gateway_response }) => {
  const payment = await Payment.findById(payment_id);
  if (!payment) _throw("Payment not found", 404, "NOT_FOUND");

  payment.status = "FAILED";
  payment.failure_reason = reason || "Payment failed";
  payment.gateway_response = gateway_response || null;
  payment.failed_at = new Date();
  await payment.save();

  await Order.findByIdAndUpdate(payment.order_id, { payment_status: "FAILED" });
  return payment;
};

const webhook = async (body) => {
  // Webhook handler — verify signature in production
  // Update payment status based on gateway payload
  const { payment_id, status, upi_txn_id } = body;
  if (!payment_id) return { received: true };

  if (status === "SUCCESS") {
    await verify({ payment_id, upi_txn_id: upi_txn_id || "WEBHOOK" });
  } else if (status === "FAILED") {
    await failure({ payment_id, reason: "Payment failed via webhook" });
  }
  return { received: true };
};

const getAll = async ({ page, limit }) => paginate(Payment, {}, { page, limit });

module.exports = { create, verify, failure, webhook, getAll };
