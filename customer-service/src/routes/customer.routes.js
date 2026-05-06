'use strict';

const { Router } = require('express');
const customerController = require('../controllers/customer.controller');
const { authenticate } = require('../middleware/auth.middleware');
const asyncHandler = require('../utils/async-handler');

const router = Router();

// Public routes
router.post('/', asyncHandler(customerController.create));
router.post('/login', asyncHandler(customerController.login));

// Protected customer routes
router.get('/me', authenticate, asyncHandler(customerController.getMe));
router.put('/me', authenticate, asyncHandler(customerController.updateMe));
router.patch(
  '/me/profile-image',
  authenticate,
  asyncHandler(customerController.updateProfileImage)
);

// CRUD routes
router.get('/', asyncHandler(customerController.findAll));
router.get('/:id', asyncHandler(customerController.findById));
router.put('/:id', asyncHandler(customerController.update));
router.delete('/:id', asyncHandler(customerController.delete));

module.exports = router;