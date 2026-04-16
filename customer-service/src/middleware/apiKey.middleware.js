'use strict';

const { sendError } = require('../utils/api-response');

/**
 * API Key middleware for customer-service.
 *
 * Every request that arrives from the API Gateway carries the header:
 *   x-api-key: <INTERNAL_API_KEY>
 *
 * This middleware rejects any request that does not present the correct key,
 * ensuring the service is not reachable directly from the public internet
 * (when network-level isolation is not possible).
 *
 * Set API_KEY in your .env — it must match INTERNAL_API_KEY on the gateway.
 */
const apiKeyMiddleware = (req, res, next) => {
  const key = req.headers['x-api-key'];

  if (!key) {
    return sendError(res, {
      statusCode: 401,
      message: 'Missing API key',
      reason: 'UNAUTHORIZED',
      detail: 'Internal requests must include the x-api-key header',
    });
  }

  if (key !== process.env.API_KEY) {
    return sendError(res, {
      statusCode: 403,
      message: 'Invalid API key',
      reason: 'FORBIDDEN',
      detail: 'The provided API key is not valid',
    });
  }

  next();
};

module.exports = { apiKeyMiddleware };
