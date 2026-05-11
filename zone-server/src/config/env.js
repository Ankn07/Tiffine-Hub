require('dotenv').config();

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,

  // MongoDB
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/zone-db',

  // API Key — must match INTERNAL_API_KEY on the gateway
  API_KEY: process.env.API_KEY || (() => { throw new Error('Missing required env variable: API_KEY'); })(),

  // JWT_SECRET no longer needed — JWT is verified at the gateway.
  // Kept as optional for any internal signing needs.
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  // External Services (kept for any direct inter-service calls)
  AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL || '',
  MAIL_SERVICE_URL: process.env.MAIL_SERVICE_URL || '',
  DEMO_AUTHANTICUSER_EMAIL: process.env.DEMO_AUTHANTICUSER_EMAIL || '',
  DEMO_AUTHANTICUSER_PASSWORD: process.env.DEMO_AUTHANTICUSER_PASSWORD || '',

  APP_NAME: 'ZONE_SERVICE',
};

module.exports = env;
