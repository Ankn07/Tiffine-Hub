'use strict';

const bcrypt = require('bcryptjs');
const customerRepository = require('../repositories/customer.repository');
const ApiError = require('../utils/api-error');
const { login } = require('../controllers/customer.controller');

const SALT_ROUNDS = 12;

const customerService = {
  async create(data) {
    // Check email uniqueness
    const existingEmail = await customerRepository.findByEmail(data.email);
    if (existingEmail) throw ApiError.conflict('A customer with this email already exists', 'EMAIL_TAKEN');

    // Check phone uniqueness
    const existingPhone = await customerRepository.findByPhone(data.phone);
    if (existingPhone) throw ApiError.conflict('A customer with this phone already exists', 'PHONE_TAKEN');

    // Hash password
    const hashed = await bcrypt.hash(data.password, SALT_ROUNDS);

    const customer = await customerRepository.create({ ...data, password: hashed });

    // Return without password
    const { password: _, ...safe } = customer;
    return safe;
  },

  async findAll({ page, limit, skip, search, sort_by, sort_order }) {
    const { items, total } = await customerRepository.findAll({ skip, take: limit, search, sort_by, sort_order });
    return { items, total, page, limit };
  },

  async findById(id) {
    const customer = await customerRepository.findById(id);
    if (!customer) throw ApiError.notFound('Customer not found');
    return customer;
  },

  async update(id, data) {
    // Ensure customer exists
    await customerService.findById(id);

    // Guard against email/phone collisions when changing them
    if (data.email) {
      const clash = await customerRepository.findByEmail(data.email);
      if (clash && clash.id !== id) throw ApiError.conflict('Email is already in use', 'EMAIL_TAKEN');
    }
    if (data.phone) {
      const clash = await customerRepository.findByPhone(data.phone);
      if (clash && clash.id !== id) throw ApiError.conflict('Phone is already in use', 'PHONE_TAKEN');
    }

    return customerRepository.update(id, data);
  },

  async delete(id) {
    await customerService.findById(id);
    await customerRepository.delete(id);
  },

  // ── "me" routes ─────────────────────────────────────────────────────────────

  async getMe(userId) {
    return customerService.findById(userId);
  },

  async updateMe(userId, data) {
    return customerService.update(userId, data);
  },

  async updateProfileImage(userId, profile_image_url) {
    await customerService.findById(userId);
    return customerRepository.update(userId, { profile_image_url });
  },
  async changePassword(userId, currentPassword, newPassword) {
    const customer = await customerService.findById(userId);

    // Verify current password
    const match = await bcrypt.compare(currentPassword, customer.password);
    if (!match) throw ApiError.unauthorized('Current password is incorrect', 'INVALID_CURRENT_PASSWORD');
    
    // Hash new password and update
    const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await customerRepository.update(userId, { password: hashed });
  },
  async login(email, password) {
    const customer = await customerRepository.findByEmail(email);
    if (!customer) throw ApiError.unauthorized('Invalid email or password', 'INVALID_CREDENTIALS');
    
    const match = await bcrypt.compare(password, customer.password);
    if (!match) throw ApiError.unauthorized('Invalid email or password', 'INVALID_CREDENTIALS');
    
    // Return without password
    const { password: _, ...safe } = customer;
    return safe;

  }

};

module.exports = customerService;
