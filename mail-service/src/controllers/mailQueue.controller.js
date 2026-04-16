import { mailQueueService } from '../services/mailQueue.service.js';
import { processQueue } from '../jobs/queue.processor.js';
import { CreateMailQueueDto, PatchQueueStatusDto } from '../dto/mail-queue/index.js';
import { sendSuccess, sendError, buildMeta, parsePagination } from '../utils/response.js';

export const mailQueueController = {
  async create(req, res) {
    const parsed = CreateMailQueueDto.safeParse(req.body);
    if (!parsed.success) {
      return sendError(res, { statusCode: 400, message: 'Validation failed', reason: 'VALIDATION_ERROR', detail: parsed.error.errors[0].message });
    }
    try {
      const data = await mailQueueService.create(parsed.data);
      return sendSuccess(res, { statusCode: 201, message: 'Mail queued successfully', data });
    } catch (err) {
      return sendError(res, { statusCode: err.statusCode ?? 500, message: err.message, reason: 'CREATE_FAILED' });
    }
  },

  async findAll(req, res) {
    const { page, limit, skip } = parsePagination(req.query);
    const status = req.query.status ?? undefined;
    try {
      const { items, total } = await mailQueueService.findAll({ page, limit, skip, status });
      return sendSuccess(res, {
        message: 'Mail queue fetched',
        data: items,
        meta: buildMeta({ page, limit, total }),
      });
    } catch (err) {
      return sendError(res, { statusCode: err.statusCode ?? 500, message: err.message, reason: 'FETCH_FAILED' });
    }
  },

  async findById(req, res) {
    try {
      const data = await mailQueueService.findById(req.params.id);
      return sendSuccess(res, { message: 'Mail queue item fetched', data });
    } catch (err) {
      return sendError(res, { statusCode: err.statusCode ?? 500, message: err.message, reason: 'NOT_FOUND' });
    }
  },

  async patchStatus(req, res) {
    const parsed = PatchQueueStatusDto.safeParse(req.body);
    if (!parsed.success) {
      return sendError(res, { statusCode: 400, message: 'Validation failed', reason: 'VALIDATION_ERROR', detail: parsed.error.errors[0].message });
    }
    try {
      const data = await mailQueueService.patchStatus(req.params.id, parsed.data.status);
      return sendSuccess(res, { message: 'Queue status updated', data });
    } catch (err) {
      return sendError(res, { statusCode: err.statusCode ?? 500, message: err.message, reason: 'PATCH_FAILED' });
    }
  },

  async retry(req, res) {
    try {
      const data = await mailQueueService.retry(req.params.id);
      return sendSuccess(res, { message: 'Queue item reset for retry', data });
    } catch (err) {
      return sendError(res, { statusCode: err.statusCode ?? 500, message: err.message, reason: 'RETRY_FAILED' });
    }
  },

  async process(req, res) {
    try {
      const summary = await processQueue();
      return sendSuccess(res, { message: 'Queue processing complete', data: summary });
    } catch (err) {
      return sendError(res, { statusCode: err.statusCode ?? 500, message: err.message, reason: 'PROCESS_FAILED' });
    }
  },

  async delete(req, res) {
    try {
      await mailQueueService.delete(req.params.id);
      return sendSuccess(res, { message: 'Queue item deleted', data: null });
    } catch (err) {
      return sendError(res, { statusCode: err.statusCode ?? 500, message: err.message, reason: 'DELETE_FAILED' });
    }
  },
};
