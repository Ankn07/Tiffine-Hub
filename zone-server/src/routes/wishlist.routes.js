const router = require("express").Router();
const ctrl = require("../controllers/wishlist.controller");
const { validate } = require("../middleware/validation.middleware");
const { authenticate } = require("../middleware/auth.middleware");
const { addToWishlistDto, toggleWishlistDto } = require("../dto/wishlist.dto");

router.get("/customer/:customerId", authenticate, ctrl.getByCustomer);
router.post("/", authenticate, validate(addToWishlistDto), ctrl.addItem);
router.get("/", authenticate, ctrl.getAll);
router.put("/:id", authenticate, ctrl.replaceItems);
router.delete("/:id", authenticate, ctrl.removeItem);
router.patch("/:id", authenticate, validate(toggleWishlistDto), ctrl.toggleItem);

module.exports = router;
