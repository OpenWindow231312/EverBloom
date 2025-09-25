"use strict";
module.exports = {
  async up(q, S) {
    await q.createTable("OrderItems", {
      orderItem_id: { type: S.INTEGER, autoIncrement: true, primaryKey: true },
      order_id: {
        type: S.INTEGER,
        allowNull: false,
        references: { model: "Orders", key: "order_id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      flower_id: {
        type: S.INTEGER,
        allowNull: false,
        references: { model: "Flowers", key: "flower_id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      quantityOrdered: { type: S.INTEGER, allowNull: false },
      unitPrice: { type: S.DECIMAL(10, 2), allowNull: false },
      discountApplied: { type: S.DECIMAL(10, 2), defaultValue: 0 },
      reservationStatus: {
        type: S.ENUM("Reserved", "Fulfilled", "Cancelled"),
        defaultValue: "Reserved",
      },
      reservedQuantity: { type: S.INTEGER, defaultValue: 0 },
      createdAt: { type: S.DATE, defaultValue: S.fn("NOW"), allowNull: false },
      updatedAt: { type: S.DATE, defaultValue: S.fn("NOW"), allowNull: false },
    });
    await q.addIndex("OrderItems", ["order_id"]);
    await q.addIndex("OrderItems", ["flower_id"]);
  },
  async down(q) {
    await q.dropTable("OrderItems");
    await q.sequelize.query(
      "DROP TYPE IF EXISTS `enum_OrderItems_reservationStatus`"
    );
  },
};
