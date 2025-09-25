"use strict";
module.exports = {
  async up(q, S) {
    await q.createTable("FlowerTypes", {
      type_id: { type: S.INTEGER, autoIncrement: true, primaryKey: true },
      type_name: { type: S.STRING, allowNull: false }, // e.g. Rose, Tulip
      default_shelf_life: { type: S.INTEGER }, // days
      notes: { type: S.TEXT },
      createdAt: { type: S.DATE, defaultValue: S.fn("NOW"), allowNull: false },
      updatedAt: { type: S.DATE, defaultValue: S.fn("NOW"), allowNull: false },
    });
  },
  async down(q) {
    await q.dropTable("FlowerTypes");
  },
};
