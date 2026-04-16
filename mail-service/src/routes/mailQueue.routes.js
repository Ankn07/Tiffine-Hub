import { Router } from 'express';
import { mailQueueController } from '../controllers/mailQueue.controller.js';

const router = Router();

// NOTE: /process must come before /:id to avoid Express matching "process" as an id
router.post('/process', mailQueueController.process);
router.post('/', mailQueueController.create);
router.get('/', mailQueueController.findAll);
router.get('/:id', mailQueueController.findById);
router.patch('/:id/status', mailQueueController.patchStatus);
router.patch('/:id/retry', mailQueueController.retry);
router.delete('/:id', mailQueueController.delete);

export default router;
