/**
 * jobs/queue.processor.js
 *
 * Serverless-compatible queue processor.
 * No setInterval — invoke this via POST /api/v1/mail-queues/process
 * or an external cron (Vercel Cron, Railway Cron, pg_cron, etc.).
 *
 * Flow per item:
 *   PENDING → PROCESSING → send email → SENT + create Mail_Log
 *                                     ↘ retry (max 3) → FAILED
 */

import { mailQueueRepository } from '../repositories/mailQueue.repository.js';
import { mailLogRepository } from '../repositories/mailLog.repository.js';
import { sendMail } from '../utils/mailer.js';
import { logger } from '../config/logger.js';

const MAX_RETRIES = 3;

/**
 * Process a single queue item end-to-end.
 * Returns { success: boolean, queueId, messageId?, error? }
 */
const processOne = async (queueItem) => {
  const { id, template, recipient_email, subject, payload, retry_count } = queueItem;

  // Lock the item
  await mailQueueRepository.markProcessing(id);

  try {
    // Interpolate payload variables into template body if payload exists
    const interpolate = (str, vars) => {
      if (!str || !vars) return str;
      return str.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? `{{${key}}}`);
    };

    const html = interpolate(template.html_body, payload);
    const text = template.text_body ? interpolate(template.text_body, payload) : undefined;

    const { messageId } = await sendMail({ to: recipient_email, subject, html, text });

    await mailQueueRepository.markSent(id);

    await mailLogRepository.create({
      queue_id: id,
      template_id: template.id,
      related_entity_type: queueItem.related_entity_type ?? null,
      related_entity_id: queueItem.related_entity_id ?? null,
      recipient_email,
      subject,
      provider: 'nodemailer',
      provider_message_id: messageId,
      delivery_status: 'SENT',
      sent_at: new Date(),
    });

    logger.info('Queue item processed successfully', { queueId: id, messageId });
    return { success: true, queueId: id, messageId };
  } catch (err) {
    const reason = err?.message ?? 'Unknown error';
    logger.error('Failed to process queue item', { queueId: id, reason, retry_count });

    await mailQueueRepository.markFailed(id, reason, retry_count);

    await mailLogRepository.create({
      queue_id: id,
      template_id: template.id,
      related_entity_type: queueItem.related_entity_type ?? null,
      related_entity_id: queueItem.related_entity_id ?? null,
      recipient_email,
      subject,
      provider: 'nodemailer',
      provider_message_id: null,
      delivery_status: 'FAILED',
      sent_at: null,
    });

    return { success: false, queueId: id, error: reason };
  }
};

/**
 * Main processor — fetch all due PENDING items and process them.
 * Returns a summary object.
 */
export const processQueue = async () => {
  const pending = await mailQueueRepository.findPendingDue();

  if (pending.length === 0) {
    logger.info('Queue processor: no pending items');
    return { processed: 0, succeeded: 0, failed: 0, results: [] };
  }

  logger.info(`Queue processor: found ${pending.length} item(s) to process`);

  // Process sequentially to avoid overwhelming the SMTP server.
  // Switch to Promise.allSettled for parallel if your SMTP allows it.
  const results = [];
  for (const item of pending) {
    const result = await processOne(item);
    results.push(result);
  }

  const succeeded = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  logger.info('Queue processor finished', { processed: results.length, succeeded, failed });

  return { processed: results.length, succeeded, failed, results };
};
