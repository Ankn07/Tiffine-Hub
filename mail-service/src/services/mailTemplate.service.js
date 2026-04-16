import { mailTemplateRepository } from '../repositories/mailTemplate.repository.js';

export const mailTemplateService = {
  async create(data) {
    const existing = await mailTemplateRepository.findBySlug(data.slug);
    if (existing) {
      const err = new Error(`A template with slug "${data.slug}" already exists`);
      err.statusCode = 409;
      throw err;
    }
    return mailTemplateRepository.create(data);
  },

  async findAll({ page, limit, skip }) {
    const { items, total } = await mailTemplateRepository.findAll({ skip, take: limit });
    return { items, total, page, limit };
  },

  async findById(id) {
    const template = await mailTemplateRepository.findById(id);
    if (!template) {
      const err = new Error('Mail template not found');
      err.statusCode = 404;
      throw err;
    }
    return template;
  },

  async update(id, data) {
    await mailTemplateService.findById(id);
    return mailTemplateRepository.update(id, data);
  },

  async patchStatus(id, is_active) {
    await mailTemplateService.findById(id);
    return mailTemplateRepository.update(id, { is_active });
  },

  async delete(id) {
    await mailTemplateService.findById(id);
    return mailTemplateRepository.delete(id);
  },
};
