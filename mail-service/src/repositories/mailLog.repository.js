import prisma from '../config/prisma.js';

export const mailLogRepository = {
  async create(data) {
    return prisma.mail_Log.create({ data });
  },

  async findAll({ skip, take }) {
    const [items, total] = await Promise.all([
      prisma.mail_Log.findMany({ skip, take, orderBy: { created_at: 'desc' } }),
      prisma.mail_Log.count(),
    ]);
    return { items, total };
  },

  async findById(id) {
    return prisma.mail_Log.findUnique({ where: { id } });
  },

  async findByQueueId(queueId, { skip, take }) {
    const where = { queue_id: queueId };
    const [items, total] = await Promise.all([
      prisma.mail_Log.findMany({ where, skip, take, orderBy: { created_at: 'desc' } }),
      prisma.mail_Log.count({ where }),
    ]);
    return { items, total };
  },

  async findByTemplateId(templateId, { skip, take }) {
    const where = { template_id: templateId };
    const [items, total] = await Promise.all([
      prisma.mail_Log.findMany({ where, skip, take, orderBy: { created_at: 'desc' } }),
      prisma.mail_Log.count({ where }),
    ]);
    return { items, total };
  },

  async findByDeliveryStatus(delivery_status, { skip, take }) {
    const where = { delivery_status };
    const [items, total] = await Promise.all([
      prisma.mail_Log.findMany({ where, skip, take, orderBy: { created_at: 'desc' } }),
      prisma.mail_Log.count({ where }),
    ]);
    return { items, total };
  },
};
