const express = require("express");
const router = express.Router();
const { Flower, FlowerType, HarvestBatch, Inventory } = require("../models");

// ===============================
// 🌸 FLOWER & TYPE MANAGEMENT
// ===============================

// ➕ Create new flower type (temporarily public for testing)
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
    console.error("Error creating flower type:", err);
    res.status(500).json({ message: "Error creating flower type" });
  }
});

// 📖 Get all flower types (public)
router.get("/types", async (req, res) => {
  try {
    const types = await FlowerType.findAll({ order: [["type_id", "ASC"]] });
    res.json(types);
  } catch (err) {
    res.status(500).json({ message: "Error fetching flower types" });
  }
});

// ➕ Add a new flower (temporarily public for dashboard)
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
    console.error("Error adding flower:", err);
    res.status(500).json({ message: "Error adding flower" });
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
    res.status(500).json({ message: "Error fetching flowers" });
  }
});

// ===============================
// 🌾 HARVEST MANAGEMENT
// ===============================

// ➕ Create new harvest batch (temporarily public for testing)
router.post("/harvests", async (req, res) => {
  try {
    const { flower_id, totalStemsHarvested, harvestDateTime, notes, status } =
      req.body;

    if (!flower_id || !totalStemsHarvested) {
      return res
        .status(400)
        .json({ message: "Flower and total stems are required" });
    }

    const harvest = await HarvestBatch.create({
      flower_id,
      totalStemsHarvested,
      harvestDateTime: harvestDateTime || new Date(),
      notes: notes || "",
      status: status || "InColdroom",
    });

    res.json({ message: "✅ Harvest batch created", harvest });
  } catch (err) {
    console.error("Error creating harvest:", err);
    res.status(500).json({ message: "Error creating harvest batch" });
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
    console.error("Error fetching harvests:", err);
    res.status(500).json({ message: "Error fetching harvest batches" });
  }
});

// ===============================
// ❄️ INVENTORY MANAGEMENT
// ===============================

// 📦 Get inventory
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
    res.status(500).json({ message: "Error fetching inventory" });
  }
});

// 🔧 Adjust inventory
router.patch("/inventory/:harvestBatch_id", async (req, res) => {
  try {
    const { harvestBatch_id } = req.params;
    const { stemsInColdroom } = req.body;

    const inv = await Inventory.findOne({ where: { harvestBatch_id } });
    if (!inv) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    inv.stemsInColdroom = stemsInColdroom;
    await inv.save();

    res.json({ message: "✅ Inventory updated", inv });
  } catch (err) {
    res.status(500).json({ message: "Error updating inventory" });
  }
});

module.exports = router;
