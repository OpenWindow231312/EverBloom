// ========================================
// ❄️ EverBloom — Inventory Routes (with proper associations + sync)
// ========================================
const express = require("express");
const router = express.Router();
const { Inventory, HarvestBatch, Flower, FlowerType } = require("../models");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");

// ===============================
// 📋 GET ALL INVENTORY
// ===============================
router.get(
  "/",
  requireAuth,
  requireRole("Admin", "Employee"),
  async (req, res) => {
    try {
      const inventory = await Inventory.findAll({
        include: [
          {
            model: HarvestBatch,
            as: "HarvestBatch",
            include: [
              {
                model: Flower,
                as: "Flower",
                include: [{ model: FlowerType, as: "FlowerType" }],
              },
            ],
          },
        ],
        order: [["inventory_id", "ASC"]],
      });
      res.json(inventory);
    } catch (err) {
      console.error("❌ Error fetching inventory:", err);
      res.status(500).json({ message: "Error fetching inventory" });
    }
  }
);

// ===============================
// ➕ ADD HARVEST BATCH TO COLDROOM
// ===============================
router.post(
  "/",
  requireAuth,
  requireRole("Admin", "Employee"),
  async (req, res) => {
    try {
      const { harvestBatch_id, stemsInColdroom } = req.body;

      if (!harvestBatch_id || !stemsInColdroom) {
        return res.status(400).json({
          message:
            "Missing required fields: harvestBatch_id or stemsInColdroom",
        });
      }

      const batch = await HarvestBatch.findByPk(harvestBatch_id);
      if (!batch) {
        return res.status(404).json({ message: "Harvest batch not found" });
      }

      // Prevent duplicate inventory entries for same batch
      const existing = await Inventory.findOne({ where: { harvestBatch_id } });
      if (existing) {
        // If already exists, just update stems count
        existing.stemsInColdroom += Number(stemsInColdroom);
        await existing.save();
      } else {
        await Inventory.create({ harvestBatch_id, stemsInColdroom });
      }

      // Update harvest batch status
      batch.status = "InColdroom";
      await batch.save();

      // Return updated data for frontend sync
      const updated = await HarvestBatch.findByPk(harvestBatch_id, {
        include: [
          {
            model: Flower,
            as: "Flower",
            include: [{ model: FlowerType, as: "FlowerType" }],
          },
          { model: Inventory, as: "Inventory" },
        ],
      });

      res.json({
        message: "✅ Harvest batch added or updated in coldroom",
        harvestBatch: updated,
      });
    } catch (err) {
      console.error("❌ Error adding to coldroom:", err);
      res.status(500).json({ message: "Error adding to coldroom" });
    }
  }
);

module.exports = router;
