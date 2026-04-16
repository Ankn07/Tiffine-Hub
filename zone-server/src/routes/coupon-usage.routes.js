const router = require("express").Router();
const ctrl = require("../controllers/coupon-usage.controller");
const { validate } = require("../middleware/validation.middleware");
const { authenticate } = require("../middleware/auth.middleware");
const { createCouponUsageDto } = require("../dto/coupon-usage.dto");

// Static paths before /:id
router.get("/customers/:customerId", authenticate, ctrl.getByCustomer);
router.get("/usages/:couponId", authenticate, ctrl.getByCoupon);

router.post("/", authenticate, validate(createCouponUsageDto), ctrl.create);
router.get("/", authenticate, ctrl.getAll);
router.get("/:id", authenticate, ctrl.getById);

module.exports = router;
