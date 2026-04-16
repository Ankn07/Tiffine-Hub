/**
 * Send a standard success response
 */
const sendSuccess = (res, { status = 200, message = "Success", data = {}, meta = {} } = {}) => {
  return res.status(status).json({
    success: true,
    message,
    data,
    meta,
  });
};

/**
 * Send a standard error response
 */
const sendError = (res, { status = 500, message = "Request failed", reason = "INTERNAL_ERROR", error = "" } = {}) => {
  return res.status(status).json({
    success: false,
    message,
    error: {
      reason,
      message: error || message,
    },
  });
};

/**
 * Build pagination meta from page, limit, total
 */
const buildMeta = (page, limit, total) => ({
  page: Number(page),
  limit: Number(limit),
  total,
  total_pages: Math.ceil(total / limit),
});

module.exports = { sendSuccess, sendError, buildMeta };
