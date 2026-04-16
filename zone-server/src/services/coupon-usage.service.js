const CouponUsage = require("../models/coupon-usage.model");
const { paginate } = require("../utils/paginate");

const create = async (data) => {
  const usage = await CouponUsage.create(data);
  // Increment coupon usage_count
  const Coupon = require("../models/coupon.model");
  await Coupon.findByIdAndUpdate(data.coupon_id, { $inc: { usage_count: 1 } });
  return usage;
};

const getAll = async ({ page, limit }) => paginate(CouponUsage, {}, { page, limit });

const getById = async (id) => {
  const u = await CouponUsage.findById(id).populate("coupon_id", "code type value");
  if (!u) { const e = new Error("Coupon usage not found"); e.status = 404; e.reason = "NOT_FOUND"; throw e; }
  return u;
};

const getByCustomer = async (customerId, { page, limit }) =>
  paginate(CouponUsage, { customer_id: customerId }, { page, limit });

const getByCoupon = async (couponId, { page, limit }) =>
  paginate(CouponUsage, { coupon_id: couponId }, { page, limit });

module.exports = { create, getAll, getById, getByCustomer, getByCoupon };
