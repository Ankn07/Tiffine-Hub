'use strict';

const { Router } = require('express');
const customerRoutes = require('./customer.routes');
const customerAddressRoutes = require('./customer-address.routes');

const router = Router();

// Customer CRUD + me routes
router.use('/customers', customerRoutes);

// Nested address routes under /customers/:customerId/addresses
router.use('/customers/:customerId/addresses', customerAddressRoutes);

module.exports = router;
