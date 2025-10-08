const express = require("express");
const router = express.Router();
const { Flower, FlowerType, HarvestBatch, Inventory } = require("../models");

// ===============================
// 🌸 Add new stock
// ===============================
router.post("/add", async (req, res) => {
  try {
    const { typeName, flowerName, harvestDate, quantity } = req.body;

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

      // Update inventory too
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
      harvestDateTime: harvestDate,
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
    console.error("Add stock error:", err);
    res
      .status(500)
      .json({ message: "❌ Failed to add stock", error: err.message });
  }
});

// ===============================
// 🌿 Get full inventory
// ===============================
router.get("/inventory", async (req, res) => {
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
    console.error("Fetch inventory error:", err);
    res.status(500).json({ message: "❌ Failed to fetch inventory" });
  }
});

// ===============================
// ✏️ Update stock quantity
// ===============================
router.put("/:id", async (req, res) => {
  try {
    const { quantity } = req.body;
    const inventory = await Inventory.findByPk(req.params.id);

    if (!inventory) return res.status(404).json({ message: "Stock not found" });

    inventory.stemsInColdroom = quantity;
    await inventory.save();

    res.json({ message: "✅ Stock updated", inventory });
  } catch (err) {
    console.error("Update stock error:", err);
    res.status(500).json({ message: "❌ Failed to update stock" });
  }
});

// ===============================
// 🗑️ Delete stock
// ===============================
router.delete("/:id", async (req, res) => {
  try {
    const inventory = await Inventory.findByPk(req.params.id);
    if (!inventory) return res.status(404).json({ message: "Not found" });

    await inventory.destroy();
    res.json({ message: "🗑️ Stock deleted successfully" });
  } catch (err) {
    console.error("Delete stock error:", err);
    res.status(500).json({ message: "❌ Failed to delete stock" });
  }
});

module.exports = router;
