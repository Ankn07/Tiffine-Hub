const { sendError } = require("../utils/response");

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error("❌ Error:", err.message);

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    return sendError(res, {
      status: 409,
      message: "Duplicate entry",
      reason: "DUPLICATE_ENTRY",
      error: `A record with this ${field} already exists`,
    });
  }

  // Mongoose cast error (bad ObjectId)
  if (err.name === "CastError") {
    return sendError(res, { status: 400, message: "Invalid ID format", reason: "INVALID_ID", error: `Invalid value for ${err.path}` });
  }

  // Mongoose validation
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message).join(", ");
    return sendError(res, { status: 400, message: "Validation failed", reason: "VALIDATION_ERROR", error: messages });
  }

  return sendError(res, {
    status: err.status || 500,
    message: err.message || "Internal server error",
    reason: "INTERNAL_ERROR",
    error: err.message,
  });
};

const notFound = (req, res) => {
  return sendError(res, {
    status: 404,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    reason: "NOT_FOUND",
    error: "The requested endpoint does not exist",
  });
};

module.exports = { errorHandler, notFound };
