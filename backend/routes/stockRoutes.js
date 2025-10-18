// ========================================
// 🌸 EverBloom — Stock Management Routes
// ========================================
const express = require("express");
const router = express.Router();

// ✅ Direct Model Imports
const Flower = require("../models/Flower");
const FlowerType = require("../models/FlowerType");
const HarvestBatch = require("../models/HarvestBatch");
const Inventory = require("../models/Inventory");

// ===============================
// ➕ Add new stock entry
// ===============================
router.post("/add", async (req, res) => {
  try {
    const { typeName, flowerName, harvestDate, quantity } = req.body;

    if (!typeName || !flowerName || !quantity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // ✅ 1. Find or create flower type
    const [type] = await FlowerType.findOrCreate({
      where: { type_name: typeName },
      defaults: { type_name: typeName },
    });

    // ✅ 2. Find or create flower
    const [flower] = await Flower.findOrCreate({
      where: { variety: flowerName },
      defaults: {
        variety: flowerName,
        type_id: type.type_id,
      },
    });

    // ✅ 3. Check if this flower already has an active batch
    const existingBatch = await HarvestBatch.findOne({
      where: { flower_id: flower.flower_id, status: "InColdroom" },
      include: [Inventory],
    });

    if (existingBatch) {
      // 🧠 Update existing batch
      existingBatch.totalStemsHarvested += Number(quantity);
      await existingBatch.save();

      if (existingBatch.Inventory) {
        existingBatch.Inventory.stemsInColdroom += Number(quantity);
        await existingBatch.Inventory.save();
      }

      return res.json({
        message: "✅ Updated existing stock batch",
        harvestBatch: existingBatch,
      });
    }

    // ✅ 4. Otherwise create new batch + inventory
    const harvest = await HarvestBatch.create({
      flower_id: flower.flower_id,
      harvestDateTime: harvestDate || new Date(),
      totalStemsHarvested: quantity,
      status: "InColdroom",
    });

    const inventory = await Inventory.create({
      harvestBatch_id: harvest.harvestBatch_id,
      stemsInColdroom: quantity,
    });

    res.json({
      message: "✅ New stock added successfully",
      harvest,
      inventory,
    });
  } catch (err) {
    console.error("❌ Add stock error:", err);
    res
      .status(500)
      .json({ message: "Failed to add stock", error: err.message });
  }
});

// ===============================
// 🌿 Get full inventory list
// ===============================
router.get("/inventory", async (_req, res) => {
  try {
    const inventory = await Inventory.findAll({
      include: [
        {
          model: HarvestBatch,
          include: [{ model: Flower, include: [FlowerType] }],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(inventory);
  } catch (err) {
    console.error("❌ Fetch inventory error:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch inventory", error: err.message });
  }
});

// ===============================
// ✏️ Update stock quantity
// ===============================
router.put("/:id", async (req, res) => {
  try {
    const { quantity } = req.body;
    if (quantity == null) {
      return res.status(400).json({ message: "Quantity is required" });
    }

    const inventory = await Inventory.findByPk(req.params.id);
    if (!inventory) return res.status(404).json({ message: "Stock not found" });

    inventory.stemsInColdroom = quantity;
    await inventory.save();

    res.json({ message: "✅ Stock updated", inventory });
  } catch (err) {
    console.error("❌ Update stock error:", err);
    res
      .status(500)
      .json({ message: "Failed to update stock", error: err.message });
  }
});

// ===============================
// 🗑️ Delete stock entry
// ===============================
router.delete("/:id", async (req, res) => {
  try {
    const inventory = await Inventory.findByPk(req.params.id);
    if (!inventory) return res.status(404).json({ message: "Not found" });

    await inventory.destroy();
    res.json({ message: "🗑️ Stock deleted successfully" });
  } catch (err) {
    console.error("❌ Delete stock error:", err);
    res
      .status(500)
      .json({ message: "Failed to delete stock", error: err.message });
  }
});

module.exports = router;
