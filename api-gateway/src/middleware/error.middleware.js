'use strict';

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error('[Gateway] Error:', err.message);

  // Axios upstream errors — surface the upstream response when available
  if (err.isAxiosError) {
    const upstream = err.response;
    if (upstream) {
      return res.status(upstream.status).json(upstream.data);
    }
    return res.status(502).json({
      success: false,
      message: 'Upstream service is unavailable',
      error: { reason: 'BAD_GATEWAY', detail: err.message },
    });
  }

  const status = err.status || err.statusCode || 500;
  return res.status(status).json({
    success: false,
    message: err.message || 'Internal server error',
    error: { reason: err.reason || 'INTERNAL_ERROR' },
  });
};

module.exports = { errorHandler };
