import { mailLogService } from '../services/mailLog.service.js';
import { sendSuccess, sendError, buildMeta, parsePagination } from '../utils/response.js';

export const mailLogController = {
  async findAll(req, res) {
    const { page, limit, skip } = parsePagination(req.query);
    try {
      const { items, total } = await mailLogService.findAll({ page, limit, skip });
      return sendSuccess(res, {
        message: 'Mail logs fetched',
        data: items,
        meta: buildMeta({ page, limit, total }),
      });
    } catch (err) {
      return sendError(res, { statusCode: err.statusCode ?? 500, message: err.message, reason: 'FETCH_FAILED' });
    }
  },

  async findById(req, res) {
    try {
      const data = await mailLogService.findById(req.params.id);
      return sendSuccess(res, { message: 'Mail log fetched', data });
    } catch (err) {
      return sendError(res, { statusCode: err.statusCode ?? 500, message: err.message, reason: 'NOT_FOUND' });
    }
  },

  async findByQueueId(req, res) {
    const { page, limit, skip } = parsePagination(req.query);
    try {
      const { items, total } = await mailLogService.findByQueueId(req.params.queueId, { page, limit, skip });
      return sendSuccess(res, {
        message: 'Mail logs fetched by queue',
        data: items,
        meta: buildMeta({ page, limit, total }),
      });
    } catch (err) {
      return sendError(res, { statusCode: err.statusCode ?? 500, message: err.message, reason: 'FETCH_FAILED' });
    }
  },

  async findByTemplateId(req, res) {
    const { page, limit, skip } = parsePagination(req.query);
    try {
      const { items, total } = await mailLogService.findByTemplateId(req.params.templateId, { page, limit, skip });
      return sendSuccess(res, {
        message: 'Mail logs fetched by template',
        data: items,
        meta: buildMeta({ page, limit, total }),
      });
    } catch (err) {
      return sendError(res, { statusCode: err.statusCode ?? 500, message: err.message, reason: 'FETCH_FAILED' });
    }
  },

  async findByStatus(req, res) {
    const { page, limit, skip } = parsePagination(req.query);
    try {
      const { items, total } = await mailLogService.findByStatus(req.params.status, { page, limit, skip });
      return sendSuccess(res, {
        message: 'Mail logs fetched by status',
        data: items,
        meta: buildMeta({ page, limit, total }),
      });
    } catch (err) {
      return sendError(res, { statusCode: err.statusCode ?? 500, message: err.message, reason: 'FETCH_FAILED' });
    }
  },
};
