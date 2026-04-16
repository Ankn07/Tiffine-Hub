const router = require("express").Router();
const ctrl = require("../controllers/authorized-person.controller");
const { validate } = require("../middleware/validation.middleware");
const { authenticate } = require("../middleware/auth.middleware");
const {
  createAuthorizedPersonDto,
  updateAuthorizedPersonDto,
  loginAuthorizedPersonDto,
  verifyOtpDto,
} = require("../dto/authorized-person.dto");

// Auth (public)
router.post("/login", validate(loginAuthorizedPersonDto), ctrl.sendOtp);
router.post("/verify-otp", validate(verifyOtpDto), ctrl.verifyOtp);

// Protected
router.post("/", authenticate, validate(createAuthorizedPersonDto), ctrl.create);
router.get("/", authenticate, ctrl.getAll);
router.get("/operators/:operatorId", authenticate, ctrl.getByOperatorId);
router.get("/:id", authenticate, ctrl.getById);
router.put("/:id", authenticate, validate(updateAuthorizedPersonDto), ctrl.update);
router.delete("/:id", authenticate, ctrl.softDelete);

module.exports = router;
