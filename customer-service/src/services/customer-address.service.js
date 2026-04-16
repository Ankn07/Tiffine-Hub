'use strict';

const customerAddressRepository = require('../repositories/customer-address.repository');
const customerRepository = require('../repositories/customer.repository');
const ApiError = require('../utils/api-error');

const customerAddressService = {
  /**
   * Verify a customer exists — throws 404 if not.
   */
  async _requireCustomer(customerId) {
    const customer = await customerRepository.findById(customerId);
    if (!customer) throw ApiError.notFound('Customer not found');
    return customer;
  },

  /**
   * Fetch an address and confirm it belongs to the given customer.
   */
  async _requireAddress(addressId, customerId) {
    const address = await customerAddressRepository.findByIdAndCustomer(addressId, customerId);
    if (!address) throw ApiError.notFound('Address not found for this customer');
    return address;
  },

  async create(customerId, data) {
    await customerAddressService._requireCustomer(customerId);

    // If this is the first address ever, force is_default = true
    const count = await customerAddressRepository.countByCustomer(customerId);
    const isDefault = count === 0 ? true : (data.is_default ?? false);

    const addressData = { ...data, customer_id: customerId, is_default: isDefault };

    // If caller wants this to be the default, use the atomic swap
    if (isDefault && count > 0) {
      // Create first, then atomically set as default
      const created = await customerAddressRepository.create({ ...addressData, is_default: false });
      await customerAddressRepository.setDefault(created.id, customerId);
      // Refresh to get updated value
      return customerAddressRepository.findById(created.id);
    }

    return customerAddressRepository.create(addressData);
  },

  async findAll(customerId, { page, limit, skip, address_type, sort_by, sort_order }) {
    await customerAddressService._requireCustomer(customerId);
    const { items, total } = await customerAddressRepository.findAll({
      customer_id: customerId,
      skip,
      take: limit,
      address_type,
      sort_by,
      sort_order,
    });
    return { items, total, page, limit };
  },

  async findById(customerId, addressId) {
    await customerAddressService._requireCustomer(customerId);
    return customerAddressService._requireAddress(addressId, customerId);
  },

  async update(customerId, addressId, data) {
    await customerAddressService._requireCustomer(customerId);
    await customerAddressService._requireAddress(addressId, customerId);

    // If caller is setting is_default via update, delegate to the atomic helper
    if (data.is_default === true) {
      await customerAddressRepository.setDefault(addressId, customerId);
      const { is_default: _, ...rest } = data;
      if (Object.keys(rest).length > 0) {
        return customerAddressRepository.update(addressId, rest);
      }
      return customerAddressRepository.findById(addressId);
    }

    return customerAddressRepository.update(addressId, data);
  },

  async setDefault(customerId, addressId) {
    await customerAddressService._requireCustomer(customerId);
    await customerAddressService._requireAddress(addressId, customerId);

    // Atomic transaction: unset all defaults → set this one
    const [, updated] = await customerAddressRepository.setDefault(addressId, customerId);
    return updated;
  },

  async delete(customerId, addressId) {
    await customerAddressService._requireCustomer(customerId);
    const address = await customerAddressService._requireAddress(addressId, customerId);

    await customerAddressRepository.delete(addressId);

    // If the deleted address was the default, promote the most-recently-created one
    if (address.is_default) {
      const remaining = await customerAddressRepository.findAll({
        customer_id: customerId,
        skip: 0,
        take: 1,
        sort_by: 'created_at',
        sort_order: 'desc',
      });
      if (remaining.items.length > 0) {
        await customerAddressRepository.setDefault(remaining.items[0].id, customerId);
      }
    }
  },
};

module.exports = customerAddressService;
