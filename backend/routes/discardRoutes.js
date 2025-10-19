const express = require("express");
const router = express.Router();
const {
  getAllDiscards,
  discardFromBatch,
} = require("../controllers/discardController");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");

router.get("/", requireAuth, requireRole("Admin", "Employee"), getAllDiscards);
router.post(
  "/:harvestBatch_id",
  requireAuth,
  requireRole("Admin", "Employee"),
  discardFromBatch
);

module.exports = router;
