'use strict';

const { sendError } = require('../utils/response');

/**
 * Gateway-aware authentication middleware for zone-server.
 *
 * The API Gateway verifies the JWT and forwards the decoded identity as:
 *   x-user-id   — authenticated user ID
 *   x-user-role — authenticated user role
 *
 * This service trusts those headers because every request that reaches
 * here has already passed apiKeyMiddleware (x-api-key validation).
 *
 * req.user is populated exactly as before so that all controllers
 * continue to work without modification.
 */
const authenticate = (req, res, next) => {
  const userId = req.headers['x-user-id'];
  const userRole = req.headers['x-user-role'];

  if (!userId) {
    return sendError(res, {
      status: 401,
      message: 'Unauthorized',
      reason: 'MISSING_USER',
      error: 'User identity not provided by gateway',
    });
  }

  req.user = {
    id: userId,
    role: userRole || null,
  };

  next();
};

module.exports = { authenticate };
