'use strict';

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const routes = require('./routes');
const { errorHandler, notFound } = require('./middleware/error.middleware');
const { apiKeyMiddleware } = require('./middleware/apiKey.middleware');

const app = express();

// ── Security & parsing ────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// ── Health check (no API key — used by infra probes) ─────────────────────────
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Zone Server API is running',
    version: '1.0.0',
    docs: '/api-docs',
    timestamp: new Date().toISOString(),
  });
});

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'OK', uptime: process.uptime() });
});

// ── Vercel Cron — internal cleanup (no API key required, Vercel controls access)
app.post('/api/cron/cleanup', async (req, res) => {
  try {
    const { runCleanup } = require('./utils/cleanup');
    const results = await runCleanup();
    res.json({ success: true, message: 'Cleanup completed', data: results });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Cleanup failed', error: err.message });
  }
});

// ── API Docs ──────────────────────────────────────────────────────────────────
app.use('/api-docs', express.static(path.join(__dirname, '../docs')));
app.get('/api-docs', (req, res) => {
  res.sendFile(path.join(__dirname, '../docs/index.html'));
});

// ── API key guard — all /api/v1 routes must originate from the gateway ────────
app.use('/api/v1', apiKeyMiddleware);

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/v1', routes);

// ── 404 & error handlers ──────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
