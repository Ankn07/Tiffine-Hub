'use strict';

/**
 * Custom API error class with a statusCode and optional reason code.
 */
class ApiError extends Error {
  constructor(message, statusCode = 500, reason = 'INTERNAL_ERROR') {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.reason = reason;
  }

  static badRequest(message, reason = 'BAD_REQUEST') {
    return new ApiError(message, 400, reason);
  }

  static unauthorized(message = 'Unauthorized', reason = 'UNAUTHORIZED') {
    return new ApiError(message, 401, reason);
  }

  static forbidden(message = 'Forbidden', reason = 'FORBIDDEN') {
    return new ApiError(message, 403, reason);
  }

  static notFound(message = 'Not found', reason = 'NOT_FOUND') {
    return new ApiError(message, 404, reason);
  }

  static conflict(message, reason = 'CONFLICT') {
    return new ApiError(message, 409, reason);
  }

  static unprocessable(message, reason = 'UNPROCESSABLE') {
    return new ApiError(message, 422, reason);
  }
}

module.exports = ApiError;
