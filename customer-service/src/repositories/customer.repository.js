'use strict';

const prisma = require('../config/prisma');

const customerRepository = {
  async create(data) {
    return prisma.customer.create({ data });
  },

  async findAll({ skip, take, search, sort_by = 'created_at', sort_order = 'desc' }) {
    const where = search
      ? {
          OR: [
            { first_name: { contains: search, mode: 'insensitive' } },
            { last_name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { phone: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take,
        orderBy: { [sort_by]: sort_order },
        select: {
          id: true,
          first_name: true,
          last_name: true,
          phone: true,
          email: true,
          profile_image_url: true,
          is_verified: true,
          created_at: true,
          updated_at: true,
          // password intentionally excluded from list queries
        },
      }),
      prisma.customer.count({ where }),
    ]);

    return { items, total };
  },

  async findById(id) {
    return prisma.customer.findUnique({
      where: { id },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        phone: true,
        email: true,
        profile_image_url: true,
        is_verified: true,
        created_at: true,
        updated_at: true,
      },
    });
  },

  // Used internally when we need to verify password — includes hashed password
  async findByIdWithPassword(id) {
    return prisma.customer.findUnique({ where: { id } });
  },

  async findByEmail(email) {
    return prisma.customer.findUnique({ where: { email } });
  },

  async findByPhone(phone) {
    return prisma.customer.findUnique({ where: { phone } });
  },

  async update(id, data) {
    return prisma.customer.update({
      where: { id },
      data,
      select: {
        id: true,
        first_name: true,
        last_name: true,
        phone: true,
        email: true,
        profile_image_url: true,
        is_verified: true,
        created_at: true,
        updated_at: true,
      },
    });
  },

  async delete(id) {
    return prisma.customer.delete({ where: { id } });
  },
};

module.exports = customerRepository;
