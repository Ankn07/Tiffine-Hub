const router = require("express").Router();
const ctrl = require("../controllers/order-status-history.controller");
const { validate } = require("../middleware/validation.middleware");
const { authenticate } = require("../middleware/auth.middleware");
const { createOrderStatusHistoryDto } = require("../dto/order-status-history.dto");

router.post("/", authenticate, validate(createOrderStatusHistoryDto), ctrl.create);
router.get("/", authenticate, ctrl.getAll);
router.get("/:id", authenticate, ctrl.getById);

module.exports = router;
