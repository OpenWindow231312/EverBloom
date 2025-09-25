"use strict";
module.exports = {
  async up(q, S) {
    await q.createTable("HarvestBatches", {
      harvestBatch_id: {
        type: S.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      flower_id: {
        type: S.INTEGER,
        allowNull: false,
        references: { model: "Flowers", key: "flower_id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      harvestDateTime: {
        type: S.DATE,
        defaultValue: S.fn("NOW"),
        allowNull: false,
      },
      totalStemsHarvested: { type: S.INTEGER, allowNull: false },
      status: {
        type: S.ENUM(
          "InColdroom",
          "PartiallyShipped",
          "ShippedOut",
          "Discarded"
        ),
        defaultValue: "InColdroom",
      },
      harvestedByEmployeeID: {
        type: S.INTEGER,
        references: { model: "Users", key: "user_id" },
        onUpdate: "SET NULL",
        onDelete: "SET NULL",
      },
      notes: { type: S.TEXT },
      createdAt: { type: S.DATE, defaultValue: S.fn("NOW"), allowNull: false },
      updatedAt: { type: S.DATE, defaultValue: S.fn("NOW"), allowNull: false },
    });
    await q.addIndex("HarvestBatches", ["flower_id"]);
  },
  async down(q) {
    await q.dropTable("HarvestBatches");
    await q.sequelize.query("DROP TYPE IF EXISTS `enum_HarvestBatches_status`"); // safety on some MySQL setups
  },
};
