const router = require("express").Router();
const dc = require("../controllers/discardController");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");

router.post(
  "/:harvestBatch_id",
  requireAuth,
  requireRole("Admin", "Employee"),
  dc.discardFromBatch
);

module.exports = router;
