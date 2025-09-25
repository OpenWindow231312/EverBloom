"use strict";
module.exports = {
  async up(q, S) {
    await q.createTable("Roles", {
      role_id: { type: S.INTEGER, autoIncrement: true, primaryKey: true },
      roleName: { type: S.STRING, allowNull: false }, // 'Admin','Employee','Customer','Florist'
      createdAt: { type: S.DATE, defaultValue: S.fn("NOW"), allowNull: false },
      updatedAt: { type: S.DATE, defaultValue: S.fn("NOW"), allowNull: false },
    });
  },
  async down(q) {
    await q.dropTable("Roles");
  },
};
