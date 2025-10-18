// ========================================
// 🌸 EverBloom — Flower Controller
// ========================================

// ✅ Direct model imports (no autoloader)
const FlowerType = require("../models/FlowerType");
const Flower = require("../models/Flower");
const HarvestBatch = require("../models/HarvestBatch");
const Inventory = require("../models/Inventory");
const sequelize = require("../db"); // ✅ DB connection for transactions
const { Sequelize } = require("sequelize");

// ===============================
// 🌷 Create a New Flower Type
// ===============================
exports.createFlowerType = async (req, res) => {
  try {
    const row = await FlowerType.create(req.body);
    res.json(row);
  } catch (e) {
    console.error("❌ Error creating flower type:", e);
    res.status(400).json({ error: e.message });
  }
};

// ===============================
// 🌼 Create a New Flower
// ===============================
exports.createFlower = async (req, res) => {
  try {
    const row = await Flower.create(req.body);
    res.json(row);
  } catch (e) {
    console.error("❌ Error creating flower:", e);
    res.status(400).json({ error: e.message });
  }
};

// ===============================
// 🌻 List All Flowers with Types
// ===============================
exports.listFlowers = async (_req, res) => {
  try {
    const rows = await Flower.findAll({
      include: [{ model: FlowerType }],
      order: [["flower_id", "ASC"]],
    });
    res.json(rows);
  } catch (e) {
    console.error("❌ Error listing flowers:", e);
    res.status(500).json({ error: e.message });
  }
};

// ===============================
// 🌾 Create Harvest Batch + Inventory
// ===============================
exports.createHarvestBatch = async (req, res) => {
  const t = await sequelize.transaction(); // ✅ use sequelize, not HarvestBatch.sequelize
  try {
    const hb = await HarvestBatch.create(req.body, { transaction: t });

    await Inventory.create(
      {
        harvestBatch_id: hb.harvestBatch_id,
        stemsInColdroom: req.body.totalStemsHarvested,
      },
      { transaction: t }
    );

    await t.commit();
    res.json(hb);
  } catch (e) {
    await t.rollback();
    console.error("❌ Error creating harvest batch:", e);
    res.status(400).json({ error: e.message });
  }
};

// ===============================
// ❄️ Get Inventory
// ===============================
exports.getInventory = async (_req, res) => {
  try {
    const rows = await Inventory.findAll({
      include: [{ model: HarvestBatch, include: [Flower] }],
      order: [["updatedAt", "DESC"]],
    });
    res.json(rows);
  } catch (e) {
    console.error("❌ Error fetching inventory:", e);
    res.status(500).json({ error: e.message });
  }
};

// ===============================
// ⚙️ Admin Manual Inventory Adjustment
// ===============================
exports.adjustInventory = async (req, res) => {
  try {
    const inv = await Inventory.findOne({
      where: { harvestBatch_id: req.params.harvestBatch_id },
    });

    if (!inv) return res.status(404).json({ error: "Inventory row not found" });

    inv.stemsInColdroom = req.body.stemsInColdroom;
    inv.lastUpdated = new Date();
    await inv.save();

    res.json(inv);
  } catch (e) {
    console.error("❌ Error adjusting inventory:", e);
    res.status(400).json({ error: e.message });
  }
};
