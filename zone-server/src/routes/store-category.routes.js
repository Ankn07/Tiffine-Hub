const router = require("express").Router();
const ctrl = require("../controllers/store-category.controller");
const { validate } = require("../middleware/validation.middleware");
const { authenticate } = require("../middleware/auth.middleware");
const { createStoreCategoryDto, updateStoreCategoryDto } = require("../dto/store-category.dto");

router.post("/", authenticate, validate(createStoreCategoryDto), ctrl.create);
router.get("/", authenticate, ctrl.getAll);
router.get("/:id", authenticate, ctrl.getById);
router.put("/:id", authenticate, validate(updateStoreCategoryDto), ctrl.update);
router.delete("/:id", authenticate, ctrl.softDelete);

module.exports = router;
