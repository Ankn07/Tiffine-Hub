'use strict';

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const routes = require('./routes/index');
const { errorMiddleware } = require('./middleware/error.middleware');
const { apiKeyMiddleware } = require('./middleware/apiKey.middleware');

const app = express();

// ── Security & logging middleware ─────────────────────────────────────────────
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Health check (no API key required — used by load balancers) ───────────────
app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Auth + Customer Service is running',
    timestamp: new Date().toISOString(),
  });
});

// ── API key guard — all /api routes must come from the gateway ────────────────
app.use('/api', apiKeyMiddleware);

// ── API routes ────────────────────────────────────────────────────────────────
app.use('/api/v1', routes);

// ── 404 fallback ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    error: { reason: 'NOT_FOUND', message: '' },
  });
});

// ── Global error handler (must be last) ──────────────────────────────────────
app.use(errorMiddleware);

module.exports = app;
