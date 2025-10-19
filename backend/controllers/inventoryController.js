// ========================================
// 🌸 EverBloom — Inventory Controller
// ========================================
const { Inventory, HarvestBatch, Flower, FlowerType } = require("../models");

exports.getAllInventory = async (req, res) => {
  try {
    const data = await Inventory.findAll({
      where: { archived: 0 },
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
      order: [
        [
          { model: HarvestBatch, as: "HarvestBatch" },
          "harvestDateTime",
          "DESC",
        ],
      ],
    });

    res.json(data);
  } catch (err) {
    console.error("❌ Inventory Controller Error:", err);
    res.status(500).json({
      error: "Failed to load inventory data",
      details: err.message,
    });
  }
};
