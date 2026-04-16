const router = require("express").Router();
const ctrl = require("../controllers/review.controller");
const { validate } = require("../middleware/validation.middleware");
const { authenticate } = require("../middleware/auth.middleware");
const { createReviewDto, updateReviewDto } = require("../dto/review.dto");

// Static sub-paths before /:id
router.get("/customer/:customerId", authenticate, ctrl.getByCustomer);
router.get("/products/:productId", authenticate, ctrl.getByProduct);
router.get("/order/:orderId", authenticate, ctrl.getByOrder);

router.post("/", authenticate, validate(createReviewDto), ctrl.create);
router.get("/", authenticate, ctrl.getAll);
router.get("/:id", authenticate, ctrl.getById);
router.put("/:id", authenticate, validate(updateReviewDto), ctrl.update);
router.delete("/:id", authenticate, ctrl.softDelete);

module.exports = router;
