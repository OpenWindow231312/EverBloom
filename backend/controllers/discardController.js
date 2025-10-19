// ========================================
// 🌸 EverBloom — Discard Controller
// ========================================

// ✅ Direct imports
const sequelize = require("../db");
const Discard = require("../models/Discard");
const Inventory = require("../models/Inventory");

// ===============================
// 🗑️ Discard Stems From a Batch
// ===============================
exports.discardFromBatch = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { harvestBatch_id } = req.params;
    const { quantityDiscarded, reason, discardedByEmployeeID } = req.body;

    // 🔍 Find inventory entry for this batch
    const inv = await Inventory.findOne({
      where: { harvestBatch_id },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!inv) {
      return res.status(404).json({ error: "Inventory row not found" });
    }

    if (inv.stemsInColdroom < quantityDiscarded) {
      return res.status(400).json({ error: "Not enough stock available" });
    }

    // 🧮 Update inventory count
    inv.stemsInColdroom -= quantityDiscarded;
    await inv.save({ transaction: t });

    // 🧾 Record discard
    const row = await Discard.create(
      {
        harvestBatch_id,
        quantityDiscarded,
        reason,
        discardedByEmployeeID,
      },
      { transaction: t }
    );

    await t.commit();
    res.json({ message: "✅ Discard recorded successfully", data: row });
  } catch (e) {
    await t.rollback();
    console.error("❌ Error discarding from batch:", e);
    res.status(400).json({ error: e.message });
  }
};
