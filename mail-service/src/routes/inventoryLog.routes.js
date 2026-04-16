import { Router } from 'express';
import { inventoryLogController } from '../controllers/inventoryLog.controller.js';

const router = Router();

// Specific sub-paths before generic /:id
router.get('/product/:productId', inventoryLogController.findByProductId);
router.get('/variant/:variantId', inventoryLogController.findByVariantId);
router.post('/', inventoryLogController.create);
router.get('/', inventoryLogController.findAll);
router.get('/:id', inventoryLogController.findById);

export default router;
