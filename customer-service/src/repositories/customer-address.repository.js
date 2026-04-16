'use strict';

const prisma = require('../config/prisma');

const customerAddressRepository = {
  async create(data) {
    return prisma.customer_Address.create({ data });
  },

  async findAll({ customer_id, skip, take, address_type, sort_by = 'created_at', sort_order = 'desc' }) {
    const where = {
      customer_id,
      ...(address_type ? { address_type } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.customer_Address.findMany({
        where,
        skip,
        take,
        orderBy: { [sort_by]: sort_order },
      }),
      prisma.customer_Address.count({ where }),
    ]);

    return { items, total };
  },

  async findById(id) {
    return prisma.customer_Address.findUnique({ where: { id } });
  },

  async findByIdAndCustomer(id, customer_id) {
    return prisma.customer_Address.findFirst({ where: { id, customer_id } });
  },

  async update(id, data) {
    return prisma.customer_Address.update({ where: { id }, data });
  },

  async delete(id) {
    return prisma.customer_Address.delete({ where: { id } });
  },

  /**
   * Atomically unset all defaults for a customer, then set the chosen address as default.
   * Uses a Prisma transaction to guarantee the one-default-per-customer rule.
   */
  async setDefault(addressId, customerId) {
    return prisma.$transaction([
      // Step 1: unset all defaults for this customer
      prisma.customer_Address.updateMany({
        where: { customer_id: customerId, is_default: true },
        data: { is_default: false },
      }),
      // Step 2: set the target address as default
      prisma.customer_Address.update({
        where: { id: addressId },
        data: { is_default: true },
      }),
    ]);
  },

  async countByCustomer(customer_id) {
    return prisma.customer_Address.count({ where: { customer_id } });
  },
};

module.exports = customerAddressRepository;
