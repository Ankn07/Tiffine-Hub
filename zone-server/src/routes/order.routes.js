const router = require("express").Router();
const ctrl = require("../controllers/order.controller");
const { validate } = require("../middleware/validation.middleware");
const { authenticate } = require("../middleware/auth.middleware");
const { createOrderDto, cancelOrderDto, statusNoteDto } = require("../dto/order.dto");

// Static sub-paths before /:id
router.get("/by-number/:orderNo", authenticate, ctrl.getByOrderNo);
router.get("/customers/:customerId", authenticate, ctrl.getByCustomer);
router.get("/stores/:storeId", authenticate, ctrl.getByStore);
router.get("/status-history/:id", authenticate, ctrl.getStatusHistory);

router.post("/", authenticate, validate(createOrderDto), ctrl.create);
router.get("/", authenticate, ctrl.getAll);
router.get("/:id", authenticate, ctrl.getById);
router.put("/:id", authenticate, ctrl.update);
router.delete("/:id", authenticate, ctrl.softDelete);
router.patch("/:id/cancel", authenticate, validate(cancelOrderDto), ctrl.cancel);
router.patch("/:id/confirm", authenticate, validate(statusNoteDto), ctrl.confirm);
router.patch("/:id/pack", authenticate, validate(statusNoteDto), ctrl.pack);
router.patch("/:id/deliver", authenticate, validate(statusNoteDto), ctrl.deliver);
router.get("/:id/items", authenticate, ctrl.getItems);
router.get("/:id/payment", authenticate, ctrl.getPayment);
router.get("/:id/delivery", authenticate, ctrl.getDelivery);

module.exports = router;
