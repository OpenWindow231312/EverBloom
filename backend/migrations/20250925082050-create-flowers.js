"use strict";
module.exports = {
  async up(q, S) {
    await q.createTable("Flowers", {
      flower_id: { type: S.INTEGER, autoIncrement: true, primaryKey: true },
      type_id: {
        type: S.INTEGER,
        references: { model: "FlowerTypes", key: "type_id" },
        onUpdate: "SET NULL",
        onDelete: "SET NULL",
      },
      variety: { type: S.STRING, allowNull: false }, // e.g. Avalanche
      color: { type: S.STRING },
      stem_length: { type: S.FLOAT }, // cm
      shelf_life: { type: S.INTEGER }, // override default
      unit: { type: S.STRING, defaultValue: "stem" },
      notes: { type: S.TEXT },
      createdAt: { type: S.DATE, defaultValue: S.fn("NOW"), allowNull: false },
      updatedAt: { type: S.DATE, defaultValue: S.fn("NOW"), allowNull: false },
    });
    await q.addIndex("Flowers", ["type_id"]);
    await q.addIndex("Flowers", ["variety", "color"]);
  },
  async down(q) {
    await q.dropTable("Flowers");
  },
};
