import prisma from '../config/prisma.js';

export const mailTemplateRepository = {
  async create(data) {
    return prisma.mail_Template.create({ data });
  },

  async findAll({ skip, take }) {
    const [items, total] = await Promise.all([
      prisma.mail_Template.findMany({ skip, take, orderBy: { created_at: 'desc' } }),
      prisma.mail_Template.count(),
    ]);
    return { items, total };
  },

  async findById(id) {
    return prisma.mail_Template.findUnique({ where: { id } });
  },

  async findBySlug(slug) {
    return prisma.mail_Template.findUnique({ where: { slug } });
  },

  async update(id, data) {
    return prisma.mail_Template.update({ where: { id }, data });
  },

  async delete(id) {
    return prisma.mail_Template.delete({ where: { id } });
  },
};
