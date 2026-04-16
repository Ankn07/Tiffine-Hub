import prisma from '../config/prisma.js';

export const inventoryLogRepository = {
  async create(data) {
    return prisma.inventory_Log.create({ data });
  },

  async findAll({ skip, take }) {
    const [items, total] = await Promise.all([
      prisma.inventory_Log.findMany({ skip, take, orderBy: { created_at: 'desc' } }),
      prisma.inventory_Log.count(),
    ]);
    return { items, total };
  },

  async findById(id) {
    return prisma.inventory_Log.findUnique({ where: { id } });
  },

  async findByProductId(product_id, { skip, take }) {
    const where = { product_id };
    const [items, total] = await Promise.all([
      prisma.inventory_Log.findMany({ where, skip, take, orderBy: { created_at: 'desc' } }),
      prisma.inventory_Log.count({ where }),
    ]);
    return { items, total };
  },

  async findByVariantId(variant_id, { skip, take }) {
    const where = { variant_id };
    const [items, total] = await Promise.all([
      prisma.inventory_Log.findMany({ where, skip, take, orderBy: { created_at: 'desc' } }),
      prisma.inventory_Log.count({ where }),
    ]);
    return { items, total };
  },
};
