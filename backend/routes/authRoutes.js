const router = require("express").Router();
const ac = require("../controllers/authController");
const { requireAuth } = require("../middleware/authMiddleware");

router.post("/register", ac.registerValidators, ac.register);
router.post("/login", ac.loginValidators, ac.login);
router.get("/me", requireAuth, ac.me);

module.exports = router;
