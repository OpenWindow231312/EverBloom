// ========================================
// 🌸 EverBloom — Discard Routes
// ========================================
const express = require("express");
const router = express.Router();

// ✅ Imports
const discardController = require("../controllers/discardController");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");

// ===============================
// 🗑️ Discard from a Harvest Batch
// ===============================
router.post(
  "/:harvestBatch_id",
  requireAuth,
  requireRole("Admin", "Employee"),
  async (req, res) => {
    try {
      await discardController.discardFromBatch(req, res);
    } catch (err) {
      console.error("❌ Error discarding from batch:", err);
      res.status(500).json({
        message: "Failed to discard from batch",
        error: err.message,
      });
    }
  }
);

module.exports = router;
