'use strict';

const { Router } = require('express');
const customerAddressController = require('../controllers/customer-address.controller');
const { authenticate } = require('../middleware/auth.middleware');
const asyncHandler = require('../utils/async-handler');

// mergeParams: true lets us access :customerId from the parent router
const router = Router({ mergeParams: true });

// All address routes require authentication
router.use(authenticate);

// IMPORTANT: /default sub-path must come BEFORE /:addressId to avoid collision
router.post('/', asyncHandler(customerAddressController.create));
router.get('/', asyncHandler(customerAddressController.findAll));
router.get('/:addressId', asyncHandler(customerAddressController.findById));
router.put('/:addressId', asyncHandler(customerAddressController.update));
router.patch('/:addressId/default', asyncHandler(customerAddressController.setDefault));
router.delete('/:addressId', asyncHandler(customerAddressController.delete));

module.exports = router;
