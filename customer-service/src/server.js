'use strict';

const app = require('./app');
const { PORT, NODE_ENV } = require('./config/env');
const logger = require('./config/logger');
const prisma = require('./config/prisma');

const server = app.listen(PORT, () => {
  logger.info(`Auth + Customer Service started on port ${PORT} [${NODE_ENV}]`);
});

// ── Graceful shutdown ─────────────────────────────────────────────────────────
const shutdown = async (signal) => {
  logger.info(`${signal} received — shutting down gracefully`);
  server.close(async () => {
    await prisma.$disconnect();
    logger.info('Database disconnected. Goodbye.');
    process.exit(0);
  });
  setTimeout(() => {
    logger.error('Force-killing after 10s timeout');
    process.exit(1);
  }, 10_000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled promise rejection', reason);
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught exception', err.message);
  process.exit(1);
});

module.exports = server;
