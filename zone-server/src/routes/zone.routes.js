const router = require("express").Router();
const ctrl = require("../controllers/zone.controller");
const { validate } = require("../middleware/validation.middleware");
const { authenticate } = require("../middleware/auth.middleware");
const { createZoneDto, updateZoneDto, singlePinCodeDto, bulkPinCodeDto } = require("../dto/zone.dto");

// Pin code operations — must come BEFORE /:id to avoid route conflicts
router.patch("/remove-pin-code", authenticate, validate(singlePinCodeDto), ctrl.removePinCode);
router.patch("/add-pin-code", authenticate, validate(singlePinCodeDto), ctrl.addPinCode);
router.patch("/remove-bulk-pin-code", authenticate, validate(bulkPinCodeDto), ctrl.removeBulkPinCodes);
router.patch("/add-bulk-pin-code", authenticate, validate(bulkPinCodeDto), ctrl.addBulkPinCodes);

router.post("/", authenticate, validate(createZoneDto), ctrl.create);
router.get("/", authenticate, ctrl.getAll);
router.get("/:id", authenticate, ctrl.getById);
router.put("/:id", authenticate, validate(updateZoneDto), ctrl.update);
router.delete("/:id", authenticate, ctrl.softDelete);

module.exports = router;
