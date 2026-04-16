const { sendError } = require("../utils/response");

/**
 * Zod validation middleware factory
 * Pass a zod schema that validates body/query/params shape
 */
const validate = (schema) => (req, res, next) => {
  try {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return sendError(res, {
        status: 400,
        message: "Validation failed",
        reason: "VALIDATION_ERROR",
        error: result.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", "),
      });
    }
    req.body = result.data;
    next();
  } catch (err) {
    return sendError(res, { status: 400, message: "Validation error", reason: "VALIDATION_ERROR", error: err.message });
  }
};

const validateQuery = (schema) => (req, res, next) => {
  try {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      return sendError(res, {
        status: 400,
        message: "Invalid query parameters",
        reason: "VALIDATION_ERROR",
        error: result.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", "),
      });
    }
    req.query = result.data;
    next();
  } catch (err) {
    return sendError(res, { status: 400, message: "Query validation error", reason: "VALIDATION_ERROR", error: err.message });
  }
};

module.exports = { validate, validateQuery };
