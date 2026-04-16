const router = require("express").Router();

// ── Existing modules ──────────────────────────────────────────────────────────
router.use("/administrators",        require("./administrator.routes"));
router.use("/operators",             require("./operator.routes"));
router.use("/authorized-person",     require("./authorized-person.routes"));
router.use("/authorize-person",      require("./authorized-person.routes")); // OTP login alias
router.use("/zones",                 require("./zone.routes"));
router.use("/store-categories",      require("./store-category.routes"));
router.use("/stores",                require("./store.routes"));
router.use("/store-users",           require("./store-user.routes"));
router.use("/product-categories",    require("./product-category.routes"));
router.use("/products",              require("./product.routes"));
router.use("/product-variants",      require("./product-variant.routes"));

// ── New commerce modules ──────────────────────────────────────────────────────
router.use("/cart",                  require("./cart.routes"));
router.use("/wishlist",              require("./wishlist.routes"));
router.use("/coupons",               require("./coupon.routes"));
router.use("/coupon-usages",         require("./coupon-usage.routes"));
router.use("/reviews",               require("./review.routes"));
router.use("/orders",                require("./order.routes"));
router.use("/payments",              require("./payment.routes"));
router.use("/refunds",               require("./refund.routes"));
router.use("/order-deliveries",      require("./order-delivery.routes"));
router.use("/orders-status-histories", require("./order-status-history.routes"));

module.exports = router;
