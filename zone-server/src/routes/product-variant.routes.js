const router = require("express").Router();
const ctrl = require("../controllers/product-variant.controller");
const { validate } = require("../middleware/validation.middleware");
const { authenticate } = require("../middleware/auth.middleware");
const { createProductVariantDto, updateProductVariantDto, updateVariantStockDto } = require("../dto/product-variant.dto");

// Static sub-paths BEFORE /:id
router.get("/products/:productsid", authenticate, ctrl.getByProductId);

router.post("/", authenticate, validate(createProductVariantDto), ctrl.create);
router.get("/", authenticate, ctrl.getAll);
router.get("/:id", authenticate, ctrl.getById);
router.put("/:id", authenticate, validate(updateProductVariantDto), ctrl.update);
router.patch("/:id/stock", authenticate, validate(updateVariantStockDto), ctrl.updateStock);
router.delete("/:id", authenticate, ctrl.softDelete);

module.exports = router;
