const router = require("express").Router();
const ctrl = require("../controllers/store-user.controller");
const { validate } = require("../middleware/validation.middleware");
const { authenticate } = require("../middleware/auth.middleware");
const { createStoreUserDto, updateStoreUserDto, storeUserStatusDto } = require("../dto/store-user.dto");

// Static sub-paths BEFORE /:id
router.get("/:storeId/store-users", authenticate, ctrl.getByStoreId);

router.post("/", authenticate, validate(createStoreUserDto), ctrl.create);
router.get("/", authenticate, ctrl.getAll);
router.get("/:id", authenticate, ctrl.getById);
router.put("/:id", authenticate, validate(updateStoreUserDto), ctrl.update);
router.patch("/:id/status", authenticate, validate(storeUserStatusDto), ctrl.updateStatus);
router.delete("/:id", authenticate, ctrl.softDelete);

module.exports = router;
