// ========================================
// 🌸 EverBloom — Flower Routes
// ========================================
const express = require("express");
const router = express.Router();

// ✅ Direct model imports
const Flower = require("../models/Flower");
const FlowerType = require("../models/FlowerType");
const HarvestBatch = require("../models/HarvestBatch");
const Inventory = require("../models/Inventory");

// ===============================
// 🌸 FLOWER TYPE MANAGEMENT
// ===============================

// ➕ Create new flower type
router.post("/types", async (req, res) => {
  try {
    const { type_name, default_shelf_life } = req.body;

    if (!type_name) {
      return res.status(400).json({ message: "Type name is required" });
    }

    const newType = await FlowerType.create({
      type_name,
      default_shelf_life: default_shelf_life || 7,
    });

    res.json({ message: "✅ Flower type added", newType });
  } catch (err) {
    console.error("❌ Error creating flower type:", err);
    res
      .status(500)
      .json({ message: "Error creating flower type", error: err.message });
  }
});

// 📖 Get all flower types
router.get("/types", async (req, res) => {
  try {
    const types = await FlowerType.findAll({ order: [["type_id", "ASC"]] });
    res.json(types);
  } catch (err) {
    console.error("❌ Error fetching flower types:", err);
    res
      .status(500)
      .json({ message: "Error fetching flower types", error: err.message });
  }
});

// ===============================
// 🌷 FLOWER MANAGEMENT
// ===============================
router.post("/flowers", async (req, res) => {
  try {
    const { type_id, variety, color, stem_length, shelf_life } = req.body;

    if (!type_id || !variety) {
      return res
        .status(400)
        .json({ message: "Type and variety are required fields" });
    }

    const newFlower = await Flower.create({
      type_id,
      variety,
      color,
      stem_length,
      shelf_life,
    });

    res.json({ message: "✅ Flower added successfully", newFlower });
  } catch (err) {
    console.error("❌ Error adding flower:", err);
    res
      .status(500)
      .json({ message: "Error adding flower", error: err.message });
  }
});

// 📖 Get all flowers
router.get("/flowers", async (req, res) => {
  try {
    const flowers = await Flower.findAll({
      include: [{ model: FlowerType, attributes: ["type_name"] }],
      order: [["flower_id", "ASC"]],
    });
    res.json(flowers);
  } catch (err) {
    console.error("❌ Error fetching flowers:", err);
    res
      .status(500)
      .json({ message: "Error fetching flowers", error: err.message });
  }
});

// ===============================
// 🌾 HARVEST MANAGEMENT
// ===============================
router.post("/harvests", async (req, res) => {
  try {
    const { flower_id, totalStemsHarvested, harvestDateTime, notes, status } =
      req.body;

    if (!flower_id || !totalStemsHarvested) {
      return res
        .status(400)
        .json({ message: "Flower ID and total stems are required" });
    }

    const harvest = await HarvestBatch.create({
      flower_id,
      totalStemsHarvested,
      harvestDateTime: harvestDateTime || new Date(),
      notes: notes || "",
      status: status || "InColdroom",
    });

    // Create matching inventory record
    await Inventory.create({
      harvestBatch_id: harvest.harvestBatch_id,
      stemsInColdroom: totalStemsHarvested,
    });

    res.json({ message: "✅ Harvest batch created", harvest });
  } catch (err) {
    console.error("❌ Error creating harvest:", err);
    res
      .status(500)
      .json({ message: "Error creating harvest batch", error: err.message });
  }
});

// 📖 Get all harvest batches
router.get("/harvests", async (req, res) => {
  try {
    const harvests = await HarvestBatch.findAll({
      include: [{ model: Flower, include: [FlowerType] }],
      order: [["harvestBatch_id", "DESC"]],
    });
    res.json(harvests);
  } catch (err) {
    console.error("❌ Error fetching harvests:", err);
    res
      .status(500)
      .json({ message: "Error fetching harvest batches", error: err.message });
  }
});

// ===============================
// ❄️ INVENTORY MANAGEMENT
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
      order: [["harvestBatch_id", "DESC"]],
    });
    res.json(inventory);
  } catch (err) {
    console.error("❌ Error fetching inventory:", err);
    res
      .status(500)
      .json({ message: "Error fetching inventory", error: err.message });
  }
});

router.patch("/inventory/:harvestBatch_id", async (req, res) => {
  try {
    const { harvestBatch_id } = req.params;
    const { stemsInColdroom } = req.body;

    if (stemsInColdroom == null) {
      return res
        .status(400)
        .json({ message: "New stock quantity is required" });
    }

    const inv = await Inventory.findOne({ where: { harvestBatch_id } });
    if (!inv) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    inv.stemsInColdroom = stemsInColdroom;
    await inv.save();

    res.json({ message: "✅ Inventory updated successfully", inv });
  } catch (err) {
    console.error("❌ Error updating inventory:", err);
    res
      .status(500)
      .json({ message: "Error updating inventory", error: err.message });
  }
});

module.exports = router;
