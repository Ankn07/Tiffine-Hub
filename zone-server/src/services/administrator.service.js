const bcrypt = require("bcryptjs");
const Administrator = require("../models/administrator.model");
const { signToken } = require("../utils/jwt");

const login = async ({ username, password }) => {
  const admin = await Administrator.findOne({ username }).select("+password");
  if (!admin) {
    const err = new Error("Invalid username or password");
    err.status = 401;
    err.reason = "INVALID_CREDENTIALS";
    throw err;
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    const err = new Error("Invalid username or password");
    err.status = 401;
    err.reason = "INVALID_CREDENTIALS";
    throw err;
  }

  const token = signToken({ id: admin._id, username: admin.username, role: "ADMINISTRATOR" });

  const { password: _pw, ...adminData } = admin.toObject();
  return { token, administrator: adminData };
};

module.exports = { login };
