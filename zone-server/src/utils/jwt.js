const jwt = require("jsonwebtoken");
const env = require("../config/env");
const bcrypt = require("bcryptjs");

const signToken = (payload) => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
};

const verifyToken = (token) => {
  return jwt.verify(token, env.JWT_SECRET);
};
const hashPassword =  async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};


module.exports = { signToken, verifyToken, hashPassword };
