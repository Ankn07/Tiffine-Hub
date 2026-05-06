'use strict';

const customerService = require('../services/customer.service');
const CreateCustomerDto = require('../dto/customer/create-customer.dto');
const UpdateCustomerDto = require('../dto/customer/update-customer.dto');
const UpdateCustomerProfileImageDto = require('../dto/customer/update-customer-profile-image.dto');
const QueryCustomerDto = require('../dto/customer/query-customer.dto');
const { sendSuccess, sendError, buildMeta } = require('../utils/api-response');
const { signToken } = require('../utils/jwt');

const customerController = {
  async create(req, res) {
    const parsed = CreateCustomerDto.safeParse(req.body);

    if (!parsed.success) {
      return sendError(res, {
        statusCode: 400,
        message: 'Validation failed',
        reason: 'VALIDATION_ERROR',
        detail: parsed.error.errors[0].message,
      });
    }

    const data = await customerService.create(parsed.data);

    return sendSuccess(res, {
      statusCode: 201,
      message: 'Customer created successfully',
      data,
    });
  },

  async login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, {
        statusCode: 400,
        message: 'Email and password are required',
        reason: 'VALIDATION_ERROR',
        detail: 'Both email and password must be provided',
      });
    }

    const customer = await customerService.login(email, password);

    const token = signToken({
      id: customer.id,
      email: customer.email,
      role: 'customer',
    });

    return sendSuccess(res, {
      message: 'Login successful',
      data: {
        ...customer,
        token,
      },
    });
  },

  async findAll(req, res) {
    const parsed = QueryCustomerDto.safeParse(req.query);

    if (!parsed.success) {
      return sendError(res, {
        statusCode: 400,
        message: 'Invalid query parameters',
        reason: 'VALIDATION_ERROR',
        detail: parsed.error.errors[0].message,
      });
    }

    const { page, limit, search, sort_by, sort_order } = parsed.data;
    const skip = (page - 1) * limit;

    const { items, total } = await customerService.findAll({
      page,
      limit,
      skip,
      search,
      sort_by,
      sort_order,
    });

    return sendSuccess(res, {
      message: 'Customers fetched successfully',
      data: items,
      meta: buildMeta({ page, limit, total }),
    });
  },

  async findById(req, res) {
    const data = await customerService.findByIdSafe(req.params.id);

    return sendSuccess(res, {
      message: 'Customer fetched successfully',
      data,
    });
  },

  async update(req, res) {
    const parsed = UpdateCustomerDto.safeParse(req.body);

    if (!parsed.success) {
      return sendError(res, {
        statusCode: 400,
        message: 'Validation failed',
        reason: 'VALIDATION_ERROR',
        detail: parsed.error.errors[0].message,
      });
    }

    const data = await customerService.update(req.params.id, parsed.data);

    return sendSuccess(res, {
      message: 'Customer updated successfully',
      data,
    });
  },

  async delete(req, res) {
    await customerService.delete(req.params.id);

    return sendSuccess(res, {
      message: 'Customer deleted successfully',
      data: null,
    });
  },

  async getMe(req, res) {
    const data = await customerService.getMe(req.user.id);

    return sendSuccess(res, {
      message: 'Profile fetched successfully',
      data,
    });
  },

  async updateMe(req, res) {
    const parsed = UpdateCustomerDto.safeParse(req.body);

    if (!parsed.success) {
      return sendError(res, {
        statusCode: 400,
        message: 'Validation failed',
        reason: 'VALIDATION_ERROR',
        detail: parsed.error.errors[0].message,
      });
    }

    const data = await customerService.updateMe(req.user.id, parsed.data);

    return sendSuccess(res, {
      message: 'Profile updated successfully',
      data,
    });
  },

  async updateProfileImage(req, res) {
    const parsed = UpdateCustomerProfileImageDto.safeParse(req.body);

    if (!parsed.success) {
      return sendError(res, {
        statusCode: 400,
        message: 'Validation failed',
        reason: 'VALIDATION_ERROR',
        detail: parsed.error.errors[0].message,
      });
    }

    const data = await customerService.updateProfileImage(
      req.user.id,
      parsed.data.profile_image_url
    );

    return sendSuccess(res, {
      message: 'Profile image updated successfully',
      data,
    });
  },
};

module.exports = customerController;