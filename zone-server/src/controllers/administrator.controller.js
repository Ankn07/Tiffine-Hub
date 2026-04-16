const adminService = require("../services/administrator.service");
const { sendSuccess, sendError } = require("../utils/response");

const login = async (req, res, next) => {
  try {
    const result = await adminService.login(req.body);
    return sendSuccess(res, { status: 200, message: "Login successful", data: result });
  } catch (err) {
    next(err);
  }
};

module.exports = { login };
