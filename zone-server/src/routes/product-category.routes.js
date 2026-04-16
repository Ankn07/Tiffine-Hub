const router = require("express").Router();
const ctrl = require("../controllers/product-category.controller");
const { validate } = require("../middleware/validation.middleware");
const { authenticate } = require("../middleware/auth.middleware");
const { createProductCategoryDto, updateProductCategoryDto } = require("../dto/product-category.dto");

router.post("/", authenticate, validate(createProductCategoryDto), ctrl.create);
router.get("/", authenticate, ctrl.getAll);
router.get("/:id", authenticate, ctrl.getById);
router.put("/:id", authenticate, validate(updateProductCategoryDto), ctrl.update);
router.delete("/:id", authenticate, ctrl.softDelete);

module.exports = router;
