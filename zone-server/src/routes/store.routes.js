const router = require("express").Router();
const ctrl = require("../controllers/store.controller");
const { validate } = require("../middleware/validation.middleware");
const { authenticate } = require("../middleware/auth.middleware");
const { createStoreDto, updateStoreDto, storeStatusDto } = require("../dto/store.dto");

// Static sub-paths BEFORE /:id
router.get("/pin-code/:pin-code", ctrl.getByPinCode);

router.post("/", authenticate, validate(createStoreDto), ctrl.create);
router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getById);
router.put("/:id", authenticate, validate(updateStoreDto), ctrl.update);
router.patch("/:id/status", authenticate, validate(storeStatusDto), ctrl.updateStatus);
router.delete("/:id", authenticate, ctrl.softDelete);

module.exports = router;
