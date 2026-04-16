'use strict';

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Gateway-level JWT middleware.
 *
 * On success:
 *   - Sets req.user = decoded payload
 *   - Downstream proxy attaches x-user-id and x-user-role headers
 *
 * Services MUST NOT verify JWT themselves — they trust these headers
 * because the request already carries x-api-key from the gateway.
 *
 * @param {object} options
 * @param {boolean} [options.optional=false] — if true, missing/invalid
 *   tokens are silently ignored (useful for mixed public/private routes).
 */
const authenticateJWT = (req, res, next, options = {}) => {
  const { optional = false } = options;

  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    if (optional) return next();
    return res.status(401).json({
      success: false,
      message: 'Authorization token is missing',
      error: { reason: 'UNAUTHORIZED' },
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, role, email, iat, exp, ... }
    next();
  } catch (err) {
    if (optional) return next();

    const reason = err.name === 'TokenExpiredError' ? 'TOKEN_EXPIRED' : 'TOKEN_INVALID';
    return res.status(401).json({
      success: false,
      message: err.name === 'TokenExpiredError' ? 'Token has expired' : 'Invalid token',
      error: { reason },
    });
  }
};

module.exports = { authenticateJWT };
