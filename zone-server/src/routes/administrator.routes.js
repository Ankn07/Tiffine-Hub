const router = require("express").Router();
const ctrl = require("../controllers/administrator.controller");
const { validate } = require("../middleware/validation.middleware");
const { createAdminDto } = require("../dto/administrator.dto");

router.post("/", validate(createAdminDto), ctrl.login);

module.exports = router;
