import { mailTemplateService } from '../services/mailTemplate.service.js';
import {
  CreateMailTemplateDto,
  UpdateMailTemplateDto,
  PatchMailTemplateStatusDto,
} from '../dto/mail-template/index.js';
import { sendSuccess, sendError, buildMeta, parsePagination } from '../utils/response.js';

export const mailTemplateController = {
  async create(req, res) {
    const parsed = CreateMailTemplateDto.safeParse(req.body);
    if (!parsed.success) {
      return sendError(res, { statusCode: 400, message: 'Validation failed', reason: 'VALIDATION_ERROR', detail: parsed.error.errors[0].message });
    }
    try {
      const data = await mailTemplateService.create(parsed.data);
      return sendSuccess(res, { statusCode: 201, message: 'Mail template created', data });
    } catch (err) {
      return sendError(res, { statusCode: err.statusCode ?? 500, message: err.message, reason: 'CREATE_FAILED' });
    }
  },

  async findAll(req, res) {
    const { page, limit, skip } = parsePagination(req.query);
    try {
      const { items, total } = await mailTemplateService.findAll({ page, limit, skip });
      return sendSuccess(res, {
        message: 'Mail templates fetched',
        data: items,
        meta: buildMeta({ page, limit, total }),
      });
    } catch (err) {
      return sendError(res, { statusCode: err.statusCode ?? 500, message: err.message, reason: 'FETCH_FAILED' });
    }
  },

  async findById(req, res) {
    try {
      const data = await mailTemplateService.findById(req.params.id);
      return sendSuccess(res, { message: 'Mail template fetched', data });
    } catch (err) {
      return sendError(res, { statusCode: err.statusCode ?? 500, message: err.message, reason: 'NOT_FOUND' });
    }
  },

  async update(req, res) {
    const parsed = UpdateMailTemplateDto.safeParse(req.body);
    if (!parsed.success) {
      return sendError(res, { statusCode: 400, message: 'Validation failed', reason: 'VALIDATION_ERROR', detail: parsed.error.errors[0].message });
    }
    try {
      const data = await mailTemplateService.update(req.params.id, parsed.data);
      return sendSuccess(res, { message: 'Mail template updated', data });
    } catch (err) {
      return sendError(res, { statusCode: err.statusCode ?? 500, message: err.message, reason: 'UPDATE_FAILED' });
    }
  },

  async patchStatus(req, res) {
    const parsed = PatchMailTemplateStatusDto.safeParse(req.body);
    if (!parsed.success) {
      return sendError(res, { statusCode: 400, message: 'Validation failed', reason: 'VALIDATION_ERROR', detail: parsed.error.errors[0].message });
    }
    try {
      const data = await mailTemplateService.patchStatus(req.params.id, parsed.data.is_active);
      return sendSuccess(res, { message: 'Mail template status updated', data });
    } catch (err) {
      return sendError(res, { statusCode: err.statusCode ?? 500, message: err.message, reason: 'PATCH_FAILED' });
    }
  },

  async delete(req, res) {
    try {
      await mailTemplateService.delete(req.params.id);
      return sendSuccess(res, { message: 'Mail template deleted', data: null });
    } catch (err) {
      return sendError(res, { statusCode: err.statusCode ?? 500, message: err.message, reason: 'DELETE_FAILED' });
    }
  },
};
