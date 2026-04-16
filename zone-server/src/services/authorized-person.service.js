const crypto = require("crypto");
const AuthorizedPerson = require("../models/authorized-person.model");
const { paginate } = require("../utils/paginate");
const { signToken } = require("../utils/jwt");

const create = async (data) => {
  return await AuthorizedPerson.create(data);
};

const getAll = async ({ page, limit, search, operator_id, role }) => {
  const filter = { is_deleted: false };
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }
  if (operator_id) filter.operator_id = operator_id;
  if (role) filter.role = role;
  return await paginate(AuthorizedPerson, filter, { page, limit });
};

const getById = async (id) => {
  const person = await AuthorizedPerson.findOne({ _id: id, is_deleted: false });
  if (!person) {
    const err = new Error("Authorized person not found");
    err.status = 404;
    err.reason = "NOT_FOUND";
    throw err;
  }
  return person;
};

const update = async (id, data) => {
  const person = await AuthorizedPerson.findOneAndUpdate(
    { _id: id, is_deleted: false },
    data,
    { new: true }
  );
  if (!person) {
    const err = new Error("Authorized person not found");
    err.status = 404;
    err.reason = "NOT_FOUND";
    throw err;
  }
  return person;
};

const softDelete = async (id) => {
  const person = await AuthorizedPerson.findOneAndUpdate(
    { _id: id, is_deleted: false },
    { is_deleted: true, deleted_at: new Date() },
    { new: true }
  );
  if (!person) {
    const err = new Error("Authorized person not found");
    err.status = 404;
    err.reason = "NOT_FOUND";
    throw err;
  }
  return person;
};

const getByOperatorId = async (operatorId, { page, limit }) => {
  const filter = { operator_id: operatorId, is_deleted: false };
  return await paginate(AuthorizedPerson, filter, { page, limit });
};

/**
 * Send OTP to authorized person email.
 * In production: call MAIL_SERVICE_URL to send the email.
 * Here we store the OTP hash and return for dev visibility.
 */
const sendOtp = async (email) => {
  const person = await AuthorizedPerson.findOne({ email, is_deleted: false });
  if (!person) {
    const err = new Error("No authorized person found with this email");
    err.status = 404;
    err.reason = "NOT_FOUND";
    throw err;
  }

  const otp = crypto.randomInt(100000, 999999).toString();
  const otp_expires_at = new Date(Date.now() + 10 * 60 * 1000); // 10 min

  await AuthorizedPerson.findByIdAndUpdate(person._id, { otp, otp_expires_at });

  // TODO: call env.MAIL_SERVICE_URL to deliver OTP via email
  // In dev mode we return it so frontend can test without email setup
  return { email, otp_expires_at, _dev_otp: otp };
};

const verifyOtp = async (email, otp) => {
  const person = await AuthorizedPerson.findOne({ email, is_deleted: false }).select("+otp +otp_expires_at");
  if (!person) {
    const err = new Error("No authorized person found with this email");
    err.status = 404;
    err.reason = "NOT_FOUND";
    throw err;
  }
  if (person.otp !== otp) {
    const err = new Error("Invalid OTP");
    err.status = 401;
    err.reason = "INVALID_OTP";
    throw err;
  }
  if (!person.otp_expires_at || person.otp_expires_at < new Date()) {
    const err = new Error("OTP has expired");
    err.status = 401;
    err.reason = "OTP_EXPIRED";
    throw err;
  }

  // Clear OTP after use
  await AuthorizedPerson.findByIdAndUpdate(person._id, { otp: null, otp_expires_at: null });

  const token = signToken({ id: person._id, email: person.email, role: person.role, operator_id: person.operator_id });
  const { otp: _o, otp_expires_at: _e, ...personData } = person.toObject();
  return { token, authorized_person: personData };
};

module.exports = { create, getAll, getById, update, softDelete, getByOperatorId, sendOtp, verifyOtp };
