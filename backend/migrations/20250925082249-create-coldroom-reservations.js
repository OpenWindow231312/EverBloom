"use strict";
module.exports = {
  async up(q, S) {
    await q.createTable("ColdroomReservations", {
      reservation_id: {
        type: S.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      orderItem_id: {
        type: S.INTEGER,
        allowNull: false,
        references: { model: "OrderItems", key: "orderItem_id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      harvestBatch_id: {
        type: S.INTEGER,
        allowNull: false,
        references: { model: "HarvestBatches", key: "harvestBatch_id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      quantityReserved: { type: S.INTEGER, allowNull: false },
      reservedAt: { type: S.DATE, defaultValue: S.fn("NOW"), allowNull: false },
      status: {
        type: S.ENUM("Active", "Released", "Fulfilled"),
        defaultValue: "Active",
      },
      createdAt: { type: S.DATE, defaultValue: S.fn("NOW"), allowNull: false },
      updatedAt: { type: S.DATE, defaultValue: S.fn("NOW"), allowNull: false },
    });
    await q.addIndex("ColdroomReservations", ["harvestBatch_id"]);
  },
  async down(q) {
    await q.dropTable("ColdroomReservations");
    await q.sequelize.query(
      "DROP TYPE IF EXISTS `enum_ColdroomReservations_status`"
    );
  },
};
