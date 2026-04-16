'use strict';

const { sendError } = require('../utils/api-response');

/**
 * Gateway-aware authentication middleware.
 *
 * The API Gateway verifies the JWT and then forwards the decoded identity
 * as trusted headers:
 *   x-user-id   — the authenticated user's ID
 *   x-user-role — the authenticated user's role
 *
 * This service NO LONGER verifies JWT directly. It trusts the gateway
 * because every incoming request is already validated by apiKeyMiddleware.
 *
 * req.user is populated identically to the old JWT approach so that
 * controllers require zero changes.
 */
const authenticate = (req, res, next) => {
  const userId = req.headers['x-user-id'];
  const userRole = req.headers['x-user-role'];

  if (!userId) {
    return sendError(res, {
      statusCode: 401,
      message: 'Unauthorized — user identity not provided by gateway',
      reason: 'UNAUTHORIZED',
      detail: 'This route requires an authenticated request through the API Gateway',
    });
  }

  // Reconstruct req.user so controllers keep working unchanged
  req.user = {
    id: userId,
    role: userRole || null,
  };

  next();
};

module.exports = { authenticate };
