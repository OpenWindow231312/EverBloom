"use strict";
module.exports = {
  async up(q, S) {
    await q.createTable("Discards", {
      discard_id: { type: S.INTEGER, autoIncrement: true, primaryKey: true },
      harvestBatch_id: {
        type: S.INTEGER,
        allowNull: false,
        references: { model: "HarvestBatches", key: "harvestBatch_id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      quantityDiscarded: { type: S.INTEGER, allowNull: false },
      reason: { type: S.STRING },
      discardDateTime: {
        type: S.DATE,
        defaultValue: S.fn("NOW"),
        allowNull: false,
      },
      discardedByEmployeeID: {
        type: S.INTEGER,
        references: { model: "Users", key: "user_id" },
        onUpdate: "SET NULL",
        onDelete: "SET NULL",
      },
      createdAt: { type: S.DATE, defaultValue: S.fn("NOW"), allowNull: false },
      updatedAt: { type: S.DATE, defaultValue: S.fn("NOW"), allowNull: false },
    });
  },
  async down(q) {
    await q.dropTable("Discards");
  },
};
