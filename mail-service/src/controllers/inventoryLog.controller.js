import { inventoryLogService } from '../services/inventoryLog.service.js';
import { CreateInventoryLogDto } from '../dto/inventory-log/index.js';
import { sendSuccess, sendError, buildMeta, parsePagination } from '../utils/response.js';

export const inventoryLogController = {
  async create(req, res) {
    const parsed = CreateInventoryLogDto.safeParse(req.body);
    if (!parsed.success) {
      return sendError(res, { statusCode: 400, message: 'Validation failed', reason: 'VALIDATION_ERROR', detail: parsed.error.errors[0].message });
    }
    try {
      const data = await inventoryLogService.create(parsed.data);
      return sendSuccess(res, { statusCode: 201, message: 'Inventory log created', data });
    } catch (err) {
      return sendError(res, { statusCode: err.statusCode ?? 500, message: err.message, reason: 'CREATE_FAILED' });
    }
  },

  async findAll(req, res) {
    const { page, limit, skip } = parsePagination(req.query);
    try {
      const { items, total } = await inventoryLogService.findAll({ page, limit, skip });
      return sendSuccess(res, {
        message: 'Inventory logs fetched',
        data: items,
        meta: buildMeta({ page, limit, total }),
      });
    } catch (err) {
      return sendError(res, { statusCode: err.statusCode ?? 500, message: err.message, reason: 'FETCH_FAILED' });
    }
  },

  async findById(req, res) {
    try {
      const data = await inventoryLogService.findById(req.params.id);
      return sendSuccess(res, { message: 'Inventory log fetched', data });
    } catch (err) {
      return sendError(res, { statusCode: err.statusCode ?? 500, message: err.message, reason: 'NOT_FOUND' });
    }
  },

  async findByProductId(req, res) {
    const { page, limit, skip } = parsePagination(req.query);
    try {
      const { items, total } = await inventoryLogService.findByProductId(req.params.productId, { page, limit, skip });
      return sendSuccess(res, {
        message: 'Inventory logs fetched by product',
        data: items,
        meta: buildMeta({ page, limit, total }),
      });
    } catch (err) {
      return sendError(res, { statusCode: err.statusCode ?? 500, message: err.message, reason: 'FETCH_FAILED' });
    }
  },

  async findByVariantId(req, res) {
    const { page, limit, skip } = parsePagination(req.query);
    try {
      const { items, total } = await inventoryLogService.findByVariantId(req.params.variantId, { page, limit, skip });
      return sendSuccess(res, {
        message: 'Inventory logs fetched by variant',
        data: items,
        meta: buildMeta({ page, limit, total }),
      });
    } catch (err) {
      return sendError(res, { statusCode: err.statusCode ?? 500, message: err.message, reason: 'FETCH_FAILED' });
    }
  },
};
