"use strict";
module.exports = {
  async up(q, S) {
    await q.createTable("Stores", {
      store_id: { type: S.INTEGER, autoIncrement: true, primaryKey: true },
      store_name: { type: S.STRING, allowNull: false },
      storeLocation: { type: S.STRING },
      address: { type: S.STRING },
      isOnline: { type: S.BOOLEAN, defaultValue: false },
      contact: { type: S.STRING },
      createdAt: { type: S.DATE, defaultValue: S.fn("NOW"), allowNull: false },
      updatedAt: { type: S.DATE, defaultValue: S.fn("NOW"), allowNull: false },
    });
  },
  async down(q) {
    await q.dropTable("Stores");
  },
};
