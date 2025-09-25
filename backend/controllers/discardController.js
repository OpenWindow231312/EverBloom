const { sequelize, Discard, Inventory } = require("../models");

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
    if (!inv) return res.status(404).json({ error: "Inventory row not found" });
    if (inv.stemsInColdroom < quantityDiscarded)
      return res.status(400).json({ error: "Not enough stock" });

    inv.stemsInColdroom -= quantityDiscarded;
    await inv.save({ transaction: t });

    const row = await Discard.create(
      { harvestBatch_id, quantityDiscarded, reason, discardedByEmployeeID },
      { transaction: t }
    );

    await t.commit();
    res.json(row);
  } catch (e) {
    await t.rollback();
    res.status(400).json({ error: e.message });
  }
};
