const { FlowerType, Flower, HarvestBatch, Inventory } = require("../models");
const { Sequelize } = require("sequelize");

exports.createFlowerType = async (req, res) => {
  try {
    const row = await FlowerType.create(req.body);
    res.json(row);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.createFlower = async (req, res) => {
  try {
    const row = await Flower.create(req.body);
    res.json(row);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.listFlowers = async (_req, res) => {
  const rows = await Flower.findAll({ include: [{ model: FlowerType }] });
  res.json(rows);
};

// Harvest a batch and open inventory
exports.createHarvestBatch = async (req, res) => {
  const t = await HarvestBatch.sequelize.transaction();
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
    res.status(400).json({ error: e.message });
  }
};

exports.getInventory = async (_req, res) => {
  const rows = await Inventory.findAll({
    include: [{ model: HarvestBatch, include: [Flower] }],
    order: [["updatedAt", "DESC"]],
  });
  res.json(rows);
};

// Admin manual adjust
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
    res.status(400).json({ error: e.message });
  }
};
