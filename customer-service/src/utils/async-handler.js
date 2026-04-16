'use strict';

/**
 * Wraps an async route handler so any thrown error is forwarded to next(err),
 * avoiding try/catch boilerplate in every controller method.
 *
 * Usage:
 *   router.get('/path', asyncHandler(async (req, res) => { ... }));
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
