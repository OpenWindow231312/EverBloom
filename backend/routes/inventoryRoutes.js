// ========================================
// ❄️ EverBloom — Inventory Routes
// ========================================
const express = require("express");
const router = express.Router();
const { Inventory, HarvestBatch } = require("../models");
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
        include: [{ model: HarvestBatch }],
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
        return res
          .status(400)
          .json({ message: "Batch already exists in coldroom" });
      }

      const newInventory = await Inventory.create({
        harvestBatch_id,
        stemsInColdroom,
      });

      // update batch status
      batch.status = "In Coldroom";
      await batch.save();

      res.json({
        message: "✅ Harvest batch added to coldroom",
        inventory: newInventory,
      });
    } catch (err) {
      console.error("❌ Error adding to coldroom:", err);
      res.status(500).json({ message: "Error adding to coldroom" });
    }
  }
);

module.exports = router;
