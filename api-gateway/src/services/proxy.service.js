'use strict';

const axios = require('axios');
const { resolveZone } = require('./zone-router.service');

const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY;
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;
const MAIL_SERVICE_URL = process.env.MAIL_SERVICE_URL;

// ── Shared Axios instance ────────────────────────────────────────────────────
const client = axios.create({
  timeout: 30_000,
  // Do not throw on non-2xx — we relay the upstream status as-is
  validateStatus: () => true,
});

/**
 * Build the forwarding headers.
 * Always includes x-api-key.
 * Includes x-user-id / x-user-role when req.user is populated by JWT middleware.
 *
 * @param {import('express').Request} req
 * @returns {object}
 */
const buildHeaders = (req) => {
  // Start from a clean copy of incoming headers, strip hop-by-hop headers
  const forwarded = { ...req.headers };
  delete forwarded['host'];
  delete forwarded['connection'];
  delete forwarded['content-length']; // Axios recalculates this

  // Internal API key — every upstream service validates this
  forwarded['x-api-key'] = INTERNAL_API_KEY;

  // Gateway-resolved user identity — services trust these without verifying JWT
  if (req.user) {
    forwarded['x-user-id'] = String(req.user.id || req.user.sub || '');
    forwarded['x-user-role'] = String(req.user.role || '');
  } else {
    // Scrub any user headers that might have been injected by a malicious client
    delete forwarded['x-user-id'];
    delete forwarded['x-user-role'];
  }

  return forwarded;
};

/**
 * Core proxy function.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {string} targetBaseUrl — e.g. "http://localhost:5001"
 */
const forward = async (req, res, targetBaseUrl) => {
  const url = `${targetBaseUrl}${req.originalUrl}`;

  try {
    const upstream = await client.request({
      method: req.method,
      url,
      headers: buildHeaders(req),
      data: req.body,
      params: req.query,
      // Stream binary responses correctly
      responseType: 'arraybuffer',
    });

    // Forward response headers (skip hop-by-hop)
    const skipHeaders = new Set(['transfer-encoding', 'connection', 'keep-alive']);
    Object.entries(upstream.headers).forEach(([key, value]) => {
      if (!skipHeaders.has(key.toLowerCase())) {
        res.setHeader(key, value);
      }
    });

    // Relay the upstream status and body
    res.status(upstream.status);

    const contentType = (upstream.headers['content-type'] || '').toLowerCase();
    if (contentType.includes('application/json')) {
      // Parse and re-serialize JSON so Express sets Content-Length correctly
      try {
        const json = JSON.parse(upstream.data.toString('utf8'));
        return res.json(json);
      } catch {
        // Fall through to raw send if parsing fails
      }
    }

    return res.send(upstream.data);
  } catch (err) {
    console.error(`[Proxy] Failed to forward to ${url}:`, err.message);

    if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
      return res.status(503).json({
        success: false,
        message: 'Upstream service is unavailable',
        error: { reason: 'SERVICE_UNAVAILABLE', detail: err.message },
      });
    }

    return res.status(502).json({
      success: false,
      message: 'Bad gateway',
      error: { reason: 'BAD_GATEWAY', detail: err.message },
    });
  }
};

// ── Named proxy handlers ──────────────────────────────────────────────────────

/** Proxy to Auth / Customer Service */
const proxyToAuth = (req, res) => forward(req, res, AUTH_SERVICE_URL);

/** Proxy to Mail + Logs Service */
const proxyToMail = (req, res) => forward(req, res, MAIL_SERVICE_URL);

/**
 * Proxy to the correct Zone Service instance.
 * Requires pin_code in query/body/header.
 */
const proxyToZone = (req, res) => {
  const zone = resolveZone(req);
  console.log(`[Proxy] Resolved zone for ${req.originalUrl}:`, zone ? zone.name : 'NOT_FOUND');
  if (!zone) {
    return res.status(400).json({
      success: false,
      message: 'pin_code is required and must map to a known zone',
      error: {
        reason: 'ZONE_NOT_FOUND',
        detail:
          'Provide pin_code as a query parameter, in the request body, or via the x-pin-code header',
      },
    });
  }

  return forward(req, res, zone.url);
};

module.exports = { proxyToAuth, proxyToMail, proxyToZone, forward };
