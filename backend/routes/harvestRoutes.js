// ========================================
// 🌾 EverBloom — Harvest Routes (Auto Coldroom Sync + Association Fix)
// ========================================
const express = require("express");
const router = express.Router();

const { HarvestBatch, Flower, FlowerType, Inventory } = require("../models");
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
        include: [
          {
            model: Flower,
            as: "Flower",
            include: [{ model: FlowerType, as: "FlowerType" }],
          },
          { model: Inventory, as: "Inventory" },
        ],
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
// ➕ Create a new harvest batch (auto adds to coldroom)
// ===============================
router.post(
  "/",
  requireAuth,
  requireRole("Admin", "Employee"),
  async (req, res) => {
    try {
      const { flower_id, totalStemsHarvested, harvestDateTime, notes } =
        req.body;

      if (!flower_id || !totalStemsHarvested) {
        return res.status(400).json({
          message: "Missing required fields: flower_id or totalStemsHarvested",
        });
      }

      // ✅ 1️⃣ Create Harvest Batch
      const newBatch = await HarvestBatch.create({
        flower_id,
        totalStemsHarvested,
        harvestDateTime: harvestDateTime || new Date(),
        notes,
        status: "InColdroom", // ✅ valid ENUM value
      });

      // ✅ 2️⃣ Auto-add to coldroom (if hook didn’t handle it)
      const existingInv = await Inventory.findOne({
        where: { harvestBatch_id: newBatch.harvestBatch_id },
      });

      if (!existingInv) {
        await Inventory.create({
          harvestBatch_id: newBatch.harvestBatch_id,
          stemsInColdroom: totalStemsHarvested,
        });
      }

      // ✅ 3️⃣ Fetch fully populated batch
      const updatedBatch = await HarvestBatch.findByPk(
        newBatch.harvestBatch_id,
        {
          include: [
            {
              model: Flower,
              as: "Flower",
              include: [{ model: FlowerType, as: "FlowerType" }],
            },
            { model: Inventory, as: "Inventory" },
          ],
        }
      );

      res.status(201).json({
        message: "✅ Harvest batch recorded and added to coldroom",
        harvestBatch: updatedBatch,
      });
    } catch (err) {
      console.error("❌ Error creating harvest batch:", err);
      res.status(500).json({ message: "Error creating harvest batch" });
    }
  }
);

module.exports = router;
