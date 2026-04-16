import { sendError } from '../utils/response.js';

/**
 * Gateway User Context Middleware for mail-service.
 *
 * The API Gateway verifies the JWT and injects:
 *   x-user-id   — authenticated user's ID
 *   x-user-role — authenticated user's role
 *
 * Apply this middleware on any route that needs to know who the caller is.
 * The mail-service itself never verifies JWTs.
 *
 * Usage in a route file:
 *   import { gatewayUser } from '../middleware/gatewayUser.middleware.js';
 *   router.get('/protected', gatewayUser, handler);
 */
export const gatewayUser = (req, res, next) => {
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

  req.user = {
    id: userId,
    role: userRole || null,
  };

  next();
};
