const router = require("express").Router();
const ctrl = require("../controllers/coupon.controller");
const { validate } = require("../middleware/validation.middleware");
const { authenticate } = require("../middleware/auth.middleware");
const { createCouponDto, updateCouponDto, couponStatusDto, validateCouponDto } = require("../dto/coupon.dto");

// Static paths before /:id
router.get("/public", ctrl.getPublic);
router.get("/code/:code", ctrl.getByCode);

router.post("/", authenticate, validate(createCouponDto), ctrl.create);
router.get("/", authenticate, ctrl.getAll);
router.get("/:id", authenticate, ctrl.getById);
router.put("/:id", authenticate, validate(updateCouponDto), ctrl.update);
router.delete("/:id", authenticate, ctrl.softDelete);
router.patch("/:id/status", authenticate, validate(couponStatusDto), ctrl.updateStatus);
router.post("/:id/validate", authenticate, validate(validateCouponDto), ctrl.validate);

module.exports = router;
