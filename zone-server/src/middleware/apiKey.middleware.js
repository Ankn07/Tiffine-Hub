'use strict';

const { sendError } = require('../utils/response');

/**
 * API Key middleware for zone-server.
 *
 * Rejects any request that does not carry the correct x-api-key header.
 * The value must match the INTERNAL_API_KEY set on the API Gateway.
 *
 * Configure via: API_KEY=<value> in .env
 */
const apiKeyMiddleware = (req, res, next) => {
  const key = req.headers['x-api-key'];

  if (!key) {
    return sendError(res, {
      status: 401,
      message: 'Missing API key',
      reason: 'UNAUTHORIZED',
      error: 'Internal requests must include the x-api-key header',
    });
  }

  if (key !== process.env.API_KEY) {
    return sendError(res, {
      status: 403,
      message: 'Invalid API key',
      reason: 'FORBIDDEN',
      error: 'The provided API key is not valid',
    });
  }

  next();
};

module.exports = { apiKeyMiddleware };
