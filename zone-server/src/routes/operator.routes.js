const router = require("express").Router();
const ctrl = require("../controllers/operator.controller");
const { validate } = require("../middleware/validation.middleware");
const { authenticate } = require("../middleware/auth.middleware");
const { createOperatorDto, updateOperatorDto, statusOperatorDto, assignOperatorDto } = require("../dto/operator.dto");

router.post("/", authenticate, validate(createOperatorDto), ctrl.create);
router.get("/", authenticate, ctrl.getAll);
router.get("/:id", authenticate, ctrl.getById);
router.patch("/:id/status", authenticate, validate(statusOperatorDto), ctrl.updateStatus);
router.delete("/:id", authenticate, ctrl.softDelete);
router.put("/:id", authenticate, validate(assignOperatorDto), ctrl.assignZoneAndPerson);

module.exports = router;
