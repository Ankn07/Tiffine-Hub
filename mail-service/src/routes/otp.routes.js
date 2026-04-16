import { Router } from 'express';
import { otpController } from '../controllers/otp.controller.js';

const router = Router();

router.post('/send', otpController.send);
router.post('/verify', otpController.verify);

export default router;
