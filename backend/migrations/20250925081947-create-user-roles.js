"use strict";
module.exports = {
  async up(q, S) {
    await q.createTable("UserRoles", {
      userRole_id: { type: S.INTEGER, autoIncrement: true, primaryKey: true },
      user_id: {
        type: S.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "user_id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      role_id: {
        type: S.INTEGER,
        allowNull: false,
        references: { model: "Roles", key: "role_id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createdAt: { type: S.DATE, defaultValue: S.fn("NOW"), allowNull: false },
      updatedAt: { type: S.DATE, defaultValue: S.fn("NOW"), allowNull: false },
    });
    await q.addConstraint("UserRoles", {
      fields: ["user_id", "role_id"],
      type: "unique",
      name: "uniq_user_role",
    });
  },
  async down(q) {
    await q.dropTable("UserRoles");
  },
};
