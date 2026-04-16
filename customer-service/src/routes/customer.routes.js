'use strict';

const { Router } = require('express');
const customerController = require('../controllers/customer.controller');
const { authenticate } = require('../middleware/auth.middleware');
const asyncHandler = require('../utils/async-handler');

const router = Router();

// ── Protected "me" routes (JWT required) ─────────────────────────────────────
// IMPORTANT: /me must be defined BEFORE /:id so Express doesn't treat "me" as an id
router.get('/me', authenticate, asyncHandler(customerController.getMe));
router.put('/me', authenticate, asyncHandler(customerController.updateMe));
router.patch('/me/profile-image', authenticate, asyncHandler(customerController.updateProfileImage));

// ── Admin / open Customer CRUD ────────────────────────────────────────────────
// In production you'd add an admin guard middleware here; omitted per spec.
router.post('/', asyncHandler(customerController.create));
router.get('/', asyncHandler(customerController.findAll));
router.get('/:id', asyncHandler(customerController.findById));
router.put('/:id', asyncHandler(customerController.update));
router.delete('/:id', asyncHandler(customerController.delete));

module.exports = router;
