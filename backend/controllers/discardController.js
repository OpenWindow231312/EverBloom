// ========================================
// 🌸 EverBloom — Discard Controller
// ========================================
const {
  sequelize,
  Discard,
  HarvestBatch,
  Flower,
  FlowerType,
  Inventory,
} = require("../models");

// ===============================
// 🗑️ GET /dashboard/discards
// ===============================
exports.getAllDiscards = async (req, res) => {
  try {
    const data = await Discard.findAll({
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
      order: [["discardDateTime", "DESC"]],
    });

    res.json(data);
  } catch (err) {
    console.error("❌ Discard Controller Error:", err);
    res.status(500).json({
      error: "Failed to load discard data",
      details: err.message,
    });
  }
};

// ===============================
// 🗑️ POST /dashboard/discards/:harvestBatch_id
// ===============================
exports.discardFromBatch = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { harvestBatch_id } = req.params;
    const { quantityDiscarded, reason, discardedByEmployeeID } = req.body;

    const inv = await Inventory.findOne({
      where: { harvestBatch_id },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!inv) {
      await t.rollback();
      return res.status(404).json({ error: "Inventory not found" });
    }

    if (inv.stemsInColdroom < quantityDiscarded) {
      await t.rollback();
      return res.status(400).json({ error: "Not enough stems in coldroom" });
    }

    inv.stemsInColdroom -= quantityDiscarded;
    inv.lastUpdated = new Date();
    if (inv.stemsInColdroom === 0) inv.archived = 1;
    await inv.save({ transaction: t });

    const discard = await Discard.create(
      {
        harvestBatch_id,
        quantityDiscarded,
        reason,
        discardedByEmployeeID,
        discardDateTime: new Date(),
      },
      { transaction: t }
    );

    await t.commit();
    res.json({ message: "✅ Discard recorded successfully", data: discard });
  } catch (err) {
    await t.rollback();
    console.error("❌ Discard Controller Error:", err);
    res.status(500).json({
      error: "Discard operation failed",
      details: err.message,
    });
  }
};
