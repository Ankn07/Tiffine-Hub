import { mailQueueRepository } from '../repositories/mailQueue.repository.js';
import { mailTemplateRepository } from '../repositories/mailTemplate.repository.js';

export const mailQueueService = {
  async create(data) {
    const template = await mailTemplateRepository.findById(data.template_id);
    if (!template) {
      const err = new Error('Mail template not found');
      err.statusCode = 404;
      throw err;
    }
    if (!template.is_active) {
      const err = new Error('Mail template is inactive and cannot be queued');
      err.statusCode = 422;
      throw err;
    }

    const payload = {
      ...data,
      scheduled_at: data.scheduled_at ? new Date(data.scheduled_at) : new Date(),
    };

    return mailQueueRepository.create(payload);
  },

  async findAll({ page, limit, skip, status }) {
    const { items, total } = await mailQueueRepository.findAll({ skip, take: limit, status });
    return { items, total, page, limit };
  },

  async findById(id) {
    const queue = await mailQueueRepository.findById(id);
    if (!queue) {
      const err = new Error('Mail queue item not found');
      err.statusCode = 404;
      throw err;
    }
    return queue;
  },

  async patchStatus(id, status) {
    await mailQueueService.findById(id);
    return mailQueueRepository.updateStatus(id, { status });
  },

  async retry(id) {
    const queue = await mailQueueService.findById(id);
    if (!['FAILED', 'CANCELLED'].includes(queue.status)) {
      const err = new Error('Only FAILED or CANCELLED queue items can be retried');
      err.statusCode = 422;
      throw err;
    }
    return mailQueueRepository.updateStatus(id, {
      status: 'PENDING',
      failure_reason: null,
      failed_at: null,
      retry_count: 0,
      scheduled_at: new Date(),
    });
  },

  async delete(id) {
    const queue = await mailQueueService.findById(id);
    if (queue.status === 'PROCESSING') {
      const err = new Error('Cannot delete a queue item that is currently being processed');
      err.statusCode = 422;
      throw err;
    }
    return mailQueueRepository.delete(id);
  },
};
