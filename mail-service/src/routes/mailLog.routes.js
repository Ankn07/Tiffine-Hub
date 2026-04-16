import { Router } from 'express';
import { mailLogController } from '../controllers/mailLog.controller.js';

const router = Router();

// Specific sub-paths before generic /:id to avoid collisions
router.get('/queue/:queueId', mailLogController.findByQueueId);
router.get('/template/:templateId', mailLogController.findByTemplateId);
router.get('/status/:status', mailLogController.findByStatus);
router.get('/', mailLogController.findAll);
router.get('/:id', mailLogController.findById);

export default router;
