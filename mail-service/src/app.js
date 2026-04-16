import express from 'express';
import { apiKeyMiddleware } from './middleware/apiKey.middleware.js';
import { errorHandler } from './middleware/errorHandler.middleware.js';
import { requestLogger } from './middleware/requestLogger.middleware.js';

import mailTemplateRoutes from './routes/mailTemplate.routes.js';
import mailQueueRoutes from './routes/mailQueue.routes.js';
import mailLogRoutes from './routes/mailLog.routes.js';
import otpRoutes from './routes/otp.routes.js';
import inventoryLogRoutes from './routes/inventoryLog.routes.js';

const app = express();

// ── Core middleware ────────────────────────────────────────────────────────────
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// ── Health check (no API key required) ────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.status(200).json({ success: true, message: 'Mail + Logs Service is running', timestamp: new Date().toISOString() });
});

// ── API key guard — applied to all /api routes ─────────────────────────────────
app.use('/api', apiKeyMiddleware);

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/v1/mail-templates', mailTemplateRoutes);
app.use('/api/v1/mail-queues', mailQueueRoutes);
app.use('/api/v1/mail-logs', mailLogRoutes);
app.use('/api/v1/otp', otpRoutes);
app.use('/api/v1/inventory-logs', inventoryLogRoutes);

// ── 404 fallback ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found', error: { reason: 'NOT_FOUND', message: '' } });
});

// ── Global error handler (must be last) ───────────────────────────────────────
app.use(errorHandler);

export default app;
