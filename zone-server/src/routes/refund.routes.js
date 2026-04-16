const router = require("express").Router();
const ctrl = require("../controllers/refund.controller");
const { validate } = require("../middleware/validation.middleware");
const { authenticate } = require("../middleware/auth.middleware");
const { createRefundDto, refundStatusDto } = require("../dto/refund.dto");

// Static sub-paths before /:id
router.get("/status", authenticate, ctrl.getByStatus);
router.get("/orders/:id", authenticate, ctrl.getByOrder);
router.get("/payments/:id", authenticate, ctrl.getByPayment);

router.post("/", authenticate, validate(createRefundDto), ctrl.create);
router.get("/", authenticate, ctrl.getAll);
router.get("/:id", authenticate, ctrl.getById);
router.patch("/:id/status", authenticate, validate(refundStatusDto), ctrl.updateStatus);

module.exports = router;
