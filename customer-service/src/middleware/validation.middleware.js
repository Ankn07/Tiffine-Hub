'use strict';

const { sendError } = require('../utils/api-response');

/**
 * Generic Zod validation middleware factory.
 *
 * Usage:
 *   router.post('/path', validate(MyDto), asyncHandler(controller.create));
 *
 * Validates req.body by default; pass 'query' or 'params' for other targets.
 */
const validate = (schema, target = 'body') => (req, res, next) => {
  const result = schema.safeParse(req[target]);
  if (!result.success) {
    const first = result.error.errors[0];
    return sendError(res, {
      statusCode: 400,
      message: 'Validation failed',
      reason: 'VALIDATION_ERROR',
      detail: `${first.path.join('.')}: ${first.message}`,
    });
  }
  // Attach the parsed (coerced + defaulted) data back to the request
  req[target] = result.data;
  next();
};

module.exports = { validate };
