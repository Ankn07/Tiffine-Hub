import { Router } from 'express';
import { mailTemplateController } from '../controllers/mailTemplate.controller.js';

const router = Router();

router.post('/', mailTemplateController.create);
router.get('/', mailTemplateController.findAll);
router.get('/:id', mailTemplateController.findById);
router.put('/:id', mailTemplateController.update);
router.patch('/:id/status', mailTemplateController.patchStatus);
router.delete('/:id', mailTemplateController.delete);

export default router;
