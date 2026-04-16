'use strict';

require('dotenv').config();

const app = require('./app');

const PORT = parseInt(process.env.PORT || '5000', 10);
const NODE_ENV = process.env.NODE_ENV || 'development';

// ── Validate required env vars on startup ─────────────────────────────────────
const REQUIRED = ['INTERNAL_API_KEY', 'JWT_SECRET', 'AUTH_SERVICE_URL', 'MAIL_SERVICE_URL', 'ZONE_SERVICES'];
const missing = REQUIRED.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`[Gateway] Missing required env variables: ${missing.join(', ')}`);
  process.exit(1);
}

// ── Validate ZONE_SERVICES is valid JSON ──────────────────────────────────────
try {
  JSON.parse(process.env.ZONE_SERVICES);
} catch {
  console.error('[Gateway] ZONE_SERVICES must be a valid JSON object. e.g. {"700091":"http://localhost:6001"}');
  process.exit(1);
}

const server = app.listen(PORT, () => {
  console.log(`[Gateway] Running on port ${PORT} [${NODE_ENV}]`);
});

// ── Graceful shutdown ─────────────────────────────────────────────────────────
const shutdown = (signal) => {
  console.log(`[Gateway] ${signal} received — shutting down`);
  server.close(() => {
    console.log('[Gateway] HTTP server closed');
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  console.error('[Gateway] Unhandled rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('[Gateway] Uncaught exception:', err.message);
  process.exit(1);
});

// ── Serverless export (Vercel / AWS Lambda via serverless-http) ───────────────
module.exports = app;
