import { mailLogRepository } from '../repositories/mailLog.repository.js';
import { DeliveryStatusParam } from '../dto/mail-log/index.js';

export const mailLogService = {
  async findAll({ page, limit, skip }) {
    const { items, total } = await mailLogRepository.findAll({ skip, take: limit });
    return { items, total, page, limit };
  },

  async findById(id) {
    const log = await mailLogRepository.findById(id);
    if (!log) {
      const err = new Error('Mail log not found');
      err.statusCode = 404;
      throw err;
    }
    return log;
  },

  async findByQueueId(queueId, { page, limit, skip }) {
    const { items, total } = await mailLogRepository.findByQueueId(queueId, { skip, take: limit });
    return { items, total, page, limit };
  },

  async findByTemplateId(templateId, { page, limit, skip }) {
    const { items, total } = await mailLogRepository.findByTemplateId(templateId, { skip, take: limit });
    return { items, total, page, limit };
  },

  async findByStatus(status, { page, limit, skip }) {
    const parsed = DeliveryStatusParam.safeParse(status);
    if (!parsed.success) {
      const err = new Error(`Invalid delivery status: "${status}"`);
      err.statusCode = 400;
      throw err;
    }
    const { items, total } = await mailLogRepository.findByDeliveryStatus(parsed.data, { skip, take: limit });
    return { items, total, page, limit };
  },
};
