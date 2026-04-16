const Coupon = require("../models/coupon.model");
const CouponUsage = require("../models/coupon-usage.model");
const { paginate } = require("../utils/paginate");

const _throw = (msg, status, reason) => { const e = new Error(msg); e.status = status; e.reason = reason; throw e; };

const create = async (data) => Coupon.create(data);

const getAll = async ({ page, limit, search, status }) => {
  const filter = { is_deleted: false };
  if (search) filter.$or = [{ code: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }];
  if (typeof status !== "undefined") filter.is_active = status === "true" || status === true;
  return paginate(Coupon, filter, { page, limit });
};

const getPublic = async ({ page, limit }) => {
  const now = new Date();
  const filter = { is_active: true, is_public: true, is_deleted: false, valid_from: { $lte: now }, valid_until: { $gte: now } };
  return paginate(Coupon, filter, { page, limit });
};

const getByCode = async (code) => {
  const coupon = await Coupon.findOne({ code: code.toUpperCase(), is_deleted: false });
  if (!coupon) _throw("Coupon not found", 404, "NOT_FOUND");
  return coupon;
};

const getById = async (id) => {
  const c = await Coupon.findOne({ _id: id, is_deleted: false });
  if (!c) _throw("Coupon not found", 404, "NOT_FOUND");
  return c;
};

const update = async (id, data) => {
  const c = await Coupon.findOneAndUpdate({ _id: id, is_deleted: false }, data, { new: true });
  if (!c) _throw("Coupon not found", 404, "NOT_FOUND");
  return c;
};

const softDelete = async (id, deleted_by) => {
  const c = await Coupon.findOneAndUpdate({ _id: id, is_deleted: false }, { is_deleted: true, deleted_at: new Date(), deleted_by }, { new: true });
  if (!c) _throw("Coupon not found", 404, "NOT_FOUND");
  return c;
};

const updateStatus = async (id, is_active) => {
  const c = await Coupon.findOneAndUpdate({ _id: id, is_deleted: false }, { is_active }, { new: true });
  if (!c) _throw("Coupon not found", 404, "NOT_FOUND");
  return c;
};

const validate = async (id, { customer_id, order_value }) => {
  const now = new Date();
  const coupon = await Coupon.findOne({ _id: id, is_deleted: false });
  if (!coupon) _throw("Coupon not found", 404, "NOT_FOUND");
  if (!coupon.is_active) _throw("Coupon is inactive", 400, "COUPON_INACTIVE");
  if (now < coupon.valid_from || now > coupon.valid_until) _throw("Coupon has expired", 400, "COUPON_EXPIRED");
  if (coupon.usage_limit !== null && coupon.usage_count >= coupon.usage_limit) _throw("Coupon usage limit exceeded", 400, "COUPON_USAGE_EXCEEDED");
  if (order_value < coupon.min_order_value) _throw(`Minimum order value of ₹${coupon.min_order_value} is required`, 400, "MIN_ORDER_NOT_MET");

  const userUsage = await CouponUsage.countDocuments({ coupon_id: id, customer_id });
  if (userUsage >= coupon.per_user_limit) _throw("You have already used this coupon", 400, "PER_USER_LIMIT_EXCEEDED");

  let discount = coupon.type === "PERCENTAGE" ? (order_value * coupon.value) / 100 : coupon.value;
  if (coupon.max_discount !== null && discount > coupon.max_discount) discount = coupon.max_discount;
  discount = Math.min(discount, order_value);

  return { coupon_id: coupon._id, code: coupon.code, discount: Math.round(discount), final_amount: Math.round(order_value - discount) };
};

module.exports = { create, getAll, getPublic, getByCode, getById, update, softDelete, updateStatus, validate };
