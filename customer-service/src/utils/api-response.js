'use strict';

/**
 * Send a success response.
 */
const sendSuccess = (res, { statusCode = 200, message = 'Success', data = null, meta = null } = {}) => {
  const body = { success: true, message, data };
  if (meta) body.meta = meta;
  return res.status(statusCode).json(body);
};

/**
 * Send an error response.
 */
const sendError = (res, { statusCode = 500, message = 'Request failed', reason = '', detail = '' } = {}) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error: { reason, message: detail },
  });
};

/**
 * Build pagination meta.
 */
const buildMeta = ({ page, limit, total }) => ({
  page,
  limit,
  total,
  total_pages: Math.ceil(total / limit),
});

/**
 * Parse and sanitise page / limit from query params.
 */
const parsePagination = (query) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 10));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

module.exports = { sendSuccess, sendError, buildMeta, parsePagination };
