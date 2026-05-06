'use strict';

const bcrypt = require('bcryptjs');
const customerRepository = require('../repositories/customer.repository');
const ApiError = require('../utils/api-error');

const SALT_ROUNDS = 12;

function removePassword(customer) {
  if (!customer) return customer;

  const plain =
    typeof customer.toObject === 'function'
      ? customer.toObject()
      : customer;

  const { password, ...safe } = plain;
  return safe;
}

const customerService = {
  async create(data) {
    const existingEmail = await customerRepository.findByEmail(data.email);

    if (existingEmail) {
      throw ApiError.conflict(
        'A customer with this email already exists',
        'EMAIL_TAKEN'
      );
    }

    const existingPhone = await customerRepository.findByPhone(data.phone);

    if (existingPhone) {
      throw ApiError.conflict(
        'A customer with this phone already exists',
        'PHONE_TAKEN'
      );
    }

    const hashed = await bcrypt.hash(data.password, SALT_ROUNDS);

    const customer = await customerRepository.create({
      ...data,
      password: hashed,
    });

    return removePassword(customer);
  },

  async findAll({ page, limit, skip, search, sort_by, sort_order }) {
    const { items, total } = await customerRepository.findAll({
      skip,
      take: limit,
      search,
      sort_by,
      sort_order,
    });

    return {
      items: items.map(removePassword),
      total,
      page,
      limit,
    };
  },

  async findById(id) {
    const customer = await customerRepository.findById(id);

    if (!customer) {
      throw ApiError.notFound('Customer not found');
    }

    return customer;
  },

  async findByIdSafe(id) {
    const customer = await customerService.findById(id);
    return removePassword(customer);
  },

  async update(id, data) {
    await customerService.findById(id);

    if (data.email) {
      const clash = await customerRepository.findByEmail(data.email);

      if (clash && String(clash.id) !== String(id)) {
        throw ApiError.conflict('Email is already in use', 'EMAIL_TAKEN');
      }
    }

    if (data.phone) {
      const clash = await customerRepository.findByPhone(data.phone);

      if (clash && String(clash.id) !== String(id)) {
        throw ApiError.conflict('Phone is already in use', 'PHONE_TAKEN');
      }
    }

    if (data.password) {
      data.password = await bcrypt.hash(data.password, SALT_ROUNDS);
    }

    const updated = await customerRepository.update(id, data);

    return removePassword(updated);
  },

  async delete(id) {
    await customerService.findById(id);
    await customerRepository.delete(id);
  },

  async getMe(userId) {
    const customer = await customerService.findById(userId);
    return removePassword(customer);
  },

  async updateMe(userId, data) {
    return customerService.update(userId, data);
  },

  async updateProfileImage(userId, profile_image_url) {
    await customerService.findById(userId);

    const updated = await customerRepository.update(userId, {
      profile_image_url,
    });

    return removePassword(updated);
  },

  async changePassword(userId, currentPassword, newPassword) {
    const customer = await customerService.findById(userId);

    const match = await bcrypt.compare(currentPassword, customer.password);

    if (!match) {
      throw ApiError.unauthorized(
        'Current password is incorrect',
        'INVALID_CURRENT_PASSWORD'
      );
    }

    const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS);

    await customerRepository.update(userId, {
      password: hashed,
    });
  },

  async login(email, password) {
    const customer = await customerRepository.findByEmail(email);

    if (!customer) {
      throw ApiError.unauthorized(
        'Invalid email or password',
        'INVALID_CREDENTIALS'
      );
    }

    const match = await bcrypt.compare(password, customer.password);

    if (!match) {
      throw ApiError.unauthorized(
        'Invalid email or password',
        'INVALID_CREDENTIALS'
      );
    }

    return removePassword(customer);
  },
};

module.exports = customerService;