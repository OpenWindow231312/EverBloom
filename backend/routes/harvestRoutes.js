// ========================================
// 🌾 EverBloom — Harvest Routes
// ========================================
const express = require("express");
const router = express.Router();

const { HarvestBatch, Flower, Inventory } = require("../models");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");

// ===============================
// 📋 Get all harvest batches
// ===============================
router.get(
  "/",
  requireAuth,
  requireRole("Admin", "Employee"),
  async (req, res) => {
    try {
      const harvests = await HarvestBatch.findAll({
        include: [{ model: Flower }, { model: Inventory }],
        order: [["harvestBatch_id", "DESC"]],
      });
      res.json(harvests);
    } catch (err) {
      console.error("❌ Error fetching harvests:", err);
      res.status(500).json({ message: "Error fetching harvests" });
    }
  }
);

// ===============================
// ➕ Create a new harvest batch
// ===============================
router.post(
  "/",
  requireAuth,
  requireRole("Admin", "Employee"),
  async (req, res) => {
    try {
      const { flower_id, totalStemsHarvested, harvestDateTime, notes } =
        req.body;

      const newBatch = await HarvestBatch.create({
        flower_id,
        totalStemsHarvested,
        harvestDateTime,
        notes,
        status: "Fresh",
      });

      res.json({
        message: "✅ Harvest batch recorded successfully",
        harvestBatch: newBatch,
      });
    } catch (err) {
      console.error("❌ Error creating harvest batch:", err);
      res.status(500).json({ message: "Error creating harvest batch" });
    }
  }
);

module.exports = router;
