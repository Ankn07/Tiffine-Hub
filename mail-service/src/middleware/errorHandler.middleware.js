import { logger } from '../config/logger.js';
import { sendError } from '../utils/response.js';

/**
 * Catches any error thrown by route handlers or passed via next(err).
 * Must be registered AFTER all routes in app.js.
 */
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  logger.error('Unhandled error', {
    method: req.method,
    path: req.path,
    message: err.message,
    stack: err.stack,
  });

  // Handle Prisma known errors
  if (err.code === 'P2002') {
    return sendError(res, {
      statusCode: 409,
      message: 'A record with this value already exists',
      reason: 'UNIQUE_CONSTRAINT_VIOLATION',
      detail: err.meta?.target?.join(', ') ?? '',
    });
  }

  if (err.code === 'P2025') {
    return sendError(res, {
      statusCode: 404,
      message: 'Record not found',
      reason: 'NOT_FOUND',
      detail: err.meta?.cause ?? '',
    });
  }

  return sendError(res, {
    statusCode: err.statusCode ?? 500,
    message: err.message ?? 'Internal server error',
    reason: 'INTERNAL_ERROR',
    detail: process.env.NODE_ENV === 'development' ? err.stack : '',
  });
};
