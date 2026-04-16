import 'dotenv/config';

const required = (key) => {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required env variable: ${key}`);
  return val;
};

export const env = {
  PORT: parseInt(process.env.PORT || '5001', 10),
  DATABASE_URL: required('DATABASE_URL'),

  SMTP_HOST: required('SMTP_HOST'),
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
  SMTP_USER: required('SMTP_USER'),
  SMTP_PASS: required('SMTP_PASS'),
  MAIL_FROM: required('MAIL_FROM'),

  API_KEY: required('API_KEY'),

  NODE_ENV: process.env.NODE_ENV || 'development',
};
