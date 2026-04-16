import { inventoryLogRepository } from '../repositories/inventoryLog.repository.js';

export const inventoryLogService = {
  async create(data) {
    return inventoryLogRepository.create(data);
  },

  async findAll({ page, limit, skip }) {
    const { items, total } = await inventoryLogRepository.findAll({ skip, take: limit });
    return { items, total, page, limit };
  },

  async findById(id) {
    const log = await inventoryLogRepository.findById(id);
    if (!log) {
      const err = new Error('Inventory log not found');
      err.statusCode = 404;
      throw err;
    }
    return log;
  },

  async findByProductId(product_id, { page, limit, skip }) {
    const { items, total } = await inventoryLogRepository.findByProductId(product_id, { skip, take: limit });
    return { items, total, page, limit };
  },

  async findByVariantId(variant_id, { page, limit, skip }) {
    const { items, total } = await inventoryLogRepository.findByVariantId(variant_id, { skip, take: limit });
    return { items, total, page, limit };
  },
};
