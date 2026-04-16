const router = require("express").Router();
const ctrl = require("../controllers/cart.controller");
const { validate } = require("../middleware/validation.middleware");
const { authenticate } = require("../middleware/auth.middleware");
const { addToCartDto, updateCartItemDto, replaceCartDto } = require("../dto/cart.dto");

router.get("/customer/:customerId", authenticate, ctrl.getByCustomer);
router.post("/", authenticate, validate(addToCartDto), ctrl.addItem);
router.get("/", authenticate, ctrl.getAll);
router.put("/:id", authenticate, validate(replaceCartDto), ctrl.replaceCart);
router.delete("/:id", authenticate, ctrl.removeItem);
router.patch("/:id", authenticate, validate(updateCartItemDto), ctrl.updateQuantity);

module.exports = router;
