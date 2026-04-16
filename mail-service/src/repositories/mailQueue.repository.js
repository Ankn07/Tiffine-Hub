import prisma from '../config/prisma.js';

export const mailQueueRepository = {
  async create(data) {
    return prisma.mail_Queue.create({ data, include: { template: true } });
  },

  async findAll({ skip, take, status }) {
    const where = status ? { status } : {};
    const [items, total] = await Promise.all([
      prisma.mail_Queue.findMany({ where, skip, take, orderBy: { created_at: 'desc' }, include: { template: true } }),
      prisma.mail_Queue.count({ where }),
    ]);
    return { items, total };
  },

  async findById(id) {
    return prisma.mail_Queue.findUnique({ where: { id }, include: { template: true } });
  },

  async updateStatus(id, data) {
    return prisma.mail_Queue.update({ where: { id }, data });
  },

  async delete(id) {
    return prisma.mail_Queue.delete({ where: { id } });
  },

  /**
   * Fetch all PENDING items whose scheduled_at is <= now.
   * Ordered oldest first so early-scheduled mails go first.
   */
  async findPendingDue() {
    return prisma.mail_Queue.findMany({
      where: {
        status: 'PENDING',
        scheduled_at: { lte: new Date() },
      },
      orderBy: { scheduled_at: 'asc' },
      include: { template: true },
    });
  },

  async markProcessing(id) {
    return prisma.mail_Queue.update({
      where: { id },
      data: { status: 'PROCESSING' },
    });
  },

  async markSent(id) {
    return prisma.mail_Queue.update({
      where: { id },
      data: { status: 'SENT', sent_at: new Date() },
    });
  },

  async markFailed(id, reason, retryCount) {
    const MAX_RETRIES = 3;
    const newStatus = retryCount >= MAX_RETRIES ? 'FAILED' : 'PENDING';
    return prisma.mail_Queue.update({
      where: { id },
      data: {
        status: newStatus,
        failed_at: newStatus === 'FAILED' ? new Date() : undefined,
        failure_reason: reason,
        retry_count: { increment: 1 },
      },
    });
  },
};
