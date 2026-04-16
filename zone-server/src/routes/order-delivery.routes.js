const router = require("express").Router();
const ctrl = require("../controllers/order-delivery.controller");
const { validate } = require("../middleware/validation.middleware");
const { authenticate } = require("../middleware/auth.middleware");
const { createOrderDeliveryDto, updateOrderDeliveryDto } = require("../dto/order-delivery.dto");

router.post("/", authenticate, validate(createOrderDeliveryDto), ctrl.create);
router.get("/", authenticate, ctrl.getAll);
router.get("/:id", authenticate, ctrl.getById);
router.put("/:id", authenticate, validate(updateOrderDeliveryDto), ctrl.update);
router.delete("/:id", authenticate, ctrl.remove);

module.exports = router;
