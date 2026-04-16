const router = require("express").Router();
const ctrl = require("../controllers/product.controller");
const { validate } = require("../middleware/validation.middleware");
const { authenticate } = require("../middleware/auth.middleware");
const { createProductDto, updateProductDto, updateStockDto } = require("../dto/product.dto");

// Static sub-paths BEFORE /:id
router.get("/stores/:storesId", authenticate, ctrl.getByStoreId);

router.post("/", authenticate, validate(createProductDto), ctrl.create);
router.get("/", authenticate, ctrl.getAll);
router.get("/:id", authenticate, ctrl.getById);
router.put("/:id", authenticate, validate(updateProductDto), ctrl.update);
router.patch("/:id/stock", authenticate, validate(updateStockDto), ctrl.updateStock);
router.delete("/:id", authenticate, ctrl.softDelete);

module.exports = router;
