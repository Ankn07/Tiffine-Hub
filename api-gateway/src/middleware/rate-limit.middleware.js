'use strict';

const rateLimit = require('express-rate-limit');

/**
 * IP-based rate limiter — 100 requests / minute per IP.
 * Applied globally before any route in app.js.
 */
const ipRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip,
  handler: (_req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests from this IP. Please try again in a minute.',
      error: { reason: 'RATE_LIMIT_EXCEEDED' },
    });
  },
});

/**
 * User-based rate limiter — 200 requests / minute per authenticated user.
 * Falls back to IP if req.user is not set (e.g. optional-auth routes).
 * Applied after JWT middleware on protected routes.
 */
const userRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // req.user is set by authenticateJWT when a valid token is present
    return req.user ? `user:${req.user.id || req.user.sub}` : `ip:${req.ip}`;
  },
  handler: (_req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests. Please slow down.',
      error: { reason: 'RATE_LIMIT_EXCEEDED' },
    });
  },
});

module.exports = { ipRateLimiter, userRateLimiter };
