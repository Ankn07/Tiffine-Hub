'use strict';

const logger = require('../config/logger');
const ApiError = require('../utils/api-error');
const { sendError } = require('../utils/api-response');

/**
 * Global error handler — must be registered AFTER all routes in app.js.
 * Catches errors from asyncHandler-wrapped routes and next(err) calls.
 */
// eslint-disable-next-line no-unused-vars
const errorMiddleware = (err, req, res, next) => {
  logger.error(`${req.method} ${req.originalUrl} — ${err.message}`, {
    stack: err.stack,
  });

  // Our own ApiError
  if (err instanceof ApiError) {
    return sendError(res, {
      statusCode: err.statusCode,
      message: err.message,
      reason: err.reason,
    });
  }

  // Prisma unique constraint violation
  if (err.code === 'P2002') {
    const field = err.meta?.target?.[0] ?? 'field';
    return sendError(res, {
      statusCode: 409,
      message: `A record with this ${field} already exists`,
      reason: 'UNIQUE_CONSTRAINT_VIOLATION',
      detail: field,
    });
  }

  // Prisma record not found
  if (err.code === 'P2025') {
    return sendError(res, {
      statusCode: 404,
      message: 'Record not found',
      reason: 'NOT_FOUND',
      detail: err.meta?.cause ?? '',
    });
  }

  // JWT errors (shouldn't normally reach here but just in case)
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return sendError(res, { statusCode: 401, message: 'Invalid or expired token', reason: 'UNAUTHORIZED' });
  }

  // Fallback — don't expose internals in production
  return sendError(res, {
    statusCode: err.statusCode ?? 500,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    reason: 'INTERNAL_ERROR',
    detail: process.env.NODE_ENV === 'development' ? err.stack : '',
  });
};

module.exports = { errorMiddleware };
