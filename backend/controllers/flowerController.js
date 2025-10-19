// ========================================
// 🌸 EverBloom — Flower Controller
// ========================================

// ✅ Direct model imports
const FlowerType = require("../models/FlowerType");
const Flower = require("../models/Flower");
const HarvestBatch = require("../models/HarvestBatch");
const Inventory = require("../models/Inventory");
const sequelize = require("../db");
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
// 🌼 Update Flower Details (Prices, Info, Status)
// ===============================
exports.updateFlower = async (req, res) => {
  try {
    const { id } = req.params;

    const flower = await Flower.findByPk(id);
    if (!flower) {
      return res.status(404).json({ error: "Flower not found" });
    }

    // 🪴 Extract editable fields only
    const {
      type_id,
      variety,
      color,
      stem_length,
      shelf_life,
      price_per_stem,
      sale_price_per_stem,
      description,
      image_url,
      is_listed_for_sale,
      is_on_sale,
    } = req.body;

    // 🧠 Parse numeric fields safely
    const updates = {
      type_id: type_id ? Number(type_id) : flower.type_id,
      variety: variety ?? flower.variety,
      color: color ?? flower.color,
      stem_length:
        stem_length !== undefined && stem_length !== ""
          ? Number(stem_length)
          : flower.stem_length,
      shelf_life:
        shelf_life !== undefined && shelf_life !== ""
          ? Number(shelf_life)
          : flower.shelf_life,
      price_per_stem:
        price_per_stem !== undefined && price_per_stem !== ""
          ? Number(price_per_stem)
          : flower.price_per_stem,
      sale_price_per_stem:
        sale_price_per_stem !== undefined && sale_price_per_stem !== ""
          ? Number(sale_price_per_stem)
          : null,
      description: description ?? flower.description,
      image_url: image_url ?? flower.image_url,
      is_listed_for_sale:
        typeof is_listed_for_sale === "boolean"
          ? is_listed_for_sale
          : flower.is_listed_for_sale,
      is_on_sale:
        typeof is_on_sale === "boolean" ? is_on_sale : flower.is_on_sale,
    };

    await flower.update(updates);

    res.json({
      message: "✅ Flower updated successfully",
      flower,
    });
  } catch (e) {
    console.error("❌ Error updating flower:", e);
    res.status(400).json({ error: e.message });
  }
};

// ===============================
// 🌾 Create Harvest Batch + Inventory
// ===============================
exports.createHarvestBatch = async (req, res) => {
  const t = await sequelize.transaction();
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
