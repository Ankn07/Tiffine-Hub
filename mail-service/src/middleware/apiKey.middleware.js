import { env } from '../config/env.js';
import { sendError } from '../utils/response.js';

/**
 * Checks for a valid x-api-key header on every request.
 * Set API_KEY in your .env to enable.
 */
export const apiKeyMiddleware = (req, res, next) => {
  const key = req.headers['x-api-key'];

  if (!key) {
    return sendError(res, {
      statusCode: 401,
      message: 'Missing API key',
      reason: 'UNAUTHORIZED',
      detail: 'Provide your API key via the x-api-key header',
    });
  }

  if (key !== env.API_KEY) {
    return sendError(res, {
      statusCode: 403,
      message: 'Invalid API key',
      reason: 'FORBIDDEN',
      detail: 'The provided API key is not valid',
    });
  }

  next();
};
