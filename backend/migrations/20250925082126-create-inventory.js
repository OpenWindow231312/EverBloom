"use strict";
module.exports = {
  async up(q, S) {
    await q.createTable("Inventories", {
      inventory_id: { type: S.INTEGER, autoIncrement: true, primaryKey: true },
      harvestBatch_id: {
        type: S.INTEGER,
        allowNull: false,
        unique: true,
        references: { model: "HarvestBatches", key: "harvestBatch_id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      stemsInColdroom: { type: S.INTEGER, allowNull: false, defaultValue: 0 },
      lastUpdated: {
        type: S.DATE,
        defaultValue: S.fn("NOW"),
        allowNull: false,
      },
      createdAt: { type: S.DATE, defaultValue: S.fn("NOW"), allowNull: false },
      updatedAt: { type: S.DATE, defaultValue: S.fn("NOW"), allowNull: false },
    });
  },
  async down(q) {
    await q.dropTable("Inventories");
  },
};
