const router = require("express").Router();
const ctrl = require("../controllers/payment.controller");
const { validate } = require("../middleware/validation.middleware");
const { authenticate } = require("../middleware/auth.middleware");
const { createPaymentDto, verifyPaymentDto, failurePaymentDto } = require("../dto/payment.dto");

router.post("/create", authenticate, validate(createPaymentDto), ctrl.create);
router.post("/verify", authenticate, validate(verifyPaymentDto), ctrl.verify);
router.post("/failure", authenticate, validate(failurePaymentDto), ctrl.failure);
router.post("/webhook", ctrl.webhook); // public — no auth, gateway calls this
router.get("/", authenticate, ctrl.getAll);

module.exports = router;
