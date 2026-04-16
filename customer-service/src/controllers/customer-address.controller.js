'use strict';

const customerAddressService = require('../services/customer-address.service');
const CreateCustomerAddressDto = require('../dto/customer-address/create-customer-address.dto');
const UpdateCustomerAddressDto = require('../dto/customer-address/update-customer-address.dto');
const QueryCustomerAddressDto = require('../dto/customer-address/query-customer-address.dto');
const { sendSuccess, sendError, buildMeta } = require('../utils/api-response');

const customerAddressController = {
  // POST /api/v1/customers/:customerId/addresses
  async create(req, res) {
    const parsed = CreateCustomerAddressDto.safeParse(req.body);
    if (!parsed.success) {
      return sendError(res, {
        statusCode: 400,
        message: 'Validation failed',
        reason: 'VALIDATION_ERROR',
        detail: parsed.error.errors[0].message,
      });
    }
    const data = await customerAddressService.create(req.params.customerId, parsed.data);
    return sendSuccess(res, { statusCode: 201, message: 'Address created successfully', data });
  },

  // GET /api/v1/customers/:customerId/addresses
  async findAll(req, res) {
    const parsed = QueryCustomerAddressDto.safeParse(req.query);
    if (!parsed.success) {
      return sendError(res, {
        statusCode: 400,
        message: 'Invalid query parameters',
        reason: 'VALIDATION_ERROR',
        detail: parsed.error.errors[0].message,
      });
    }
    const { page, limit, address_type, sort_by, sort_order } = parsed.data;
    const skip = (page - 1) * limit;
    const { items, total } = await customerAddressService.findAll(req.params.customerId, {
      page, limit, skip, address_type, sort_by, sort_order,
    });
    return sendSuccess(res, {
      message: 'Addresses fetched successfully',
      data: items,
      meta: buildMeta({ page, limit, total }),
    });
  },

  // GET /api/v1/customers/:customerId/addresses/:addressId
  async findById(req, res) {
    const data = await customerAddressService.findById(req.params.customerId, req.params.addressId);
    return sendSuccess(res, { message: 'Address fetched successfully', data });
  },

  // PUT /api/v1/customers/:customerId/addresses/:addressId
  async update(req, res) {
    const parsed = UpdateCustomerAddressDto.safeParse(req.body);
    if (!parsed.success) {
      return sendError(res, {
        statusCode: 400,
        message: 'Validation failed',
        reason: 'VALIDATION_ERROR',
        detail: parsed.error.errors[0].message,
      });
    }
    const data = await customerAddressService.update(
      req.params.customerId,
      req.params.addressId,
      parsed.data,
    );
    return sendSuccess(res, { message: 'Address updated successfully', data });
  },

  // PATCH /api/v1/customers/:customerId/addresses/:addressId/default
  async setDefault(req, res) {
    const data = await customerAddressService.setDefault(req.params.customerId, req.params.addressId);
    return sendSuccess(res, { message: 'Default address updated successfully', data });
  },

  // DELETE /api/v1/customers/:customerId/addresses/:addressId
  async delete(req, res) {
    await customerAddressService.delete(req.params.customerId, req.params.addressId);
    return sendSuccess(res, { message: 'Address deleted successfully', data: null });
  },
};

module.exports = customerAddressController;
