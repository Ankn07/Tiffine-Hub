'use strict';

require('dotenv').config();

const required = (key) => {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required env variable: ${key}`);
  return val;
};

module.exports = {
  PORT: parseInt(process.env.PORT || '5001', 10),
  DATABASE_URL: required('DATABASE_URL'),
  // API_KEY — must match INTERNAL_API_KEY on the gateway
  API_KEY: required('API_KEY'),
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  JWT_SECRET: process.env.JWT_SECRET // Placeholder value — not used in this service

  // JWT_SECRET removed — JWT verification is handled by the API Gateway.
};
