import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

let _transporter = null;

const getTransporter = () => {
  if (_transporter) return _transporter;

  _transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });

  return _transporter;
};

/**
 * Send an email.
 * @param {{ to: string, subject: string, html?: string, text?: string }} opts
 * @returns {Promise<{ messageId: string }>}
 */
export const sendMail = async ({ to, subject, html, text }) => {
  const transporter = getTransporter();

  const info = await transporter.sendMail({
    from: env.MAIL_FROM,
    to,
    subject,
    html,
    text,
  });

  logger.info('Email sent', { messageId: info.messageId, to, subject });
  return { messageId: info.messageId };
};
