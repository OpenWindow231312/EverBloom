"use strict";
module.exports = {
  async up(q, S) {
    await q.createTable("Orders", {
      order_id: { type: S.INTEGER, autoIncrement: true, primaryKey: true },
      user_id: {
        type: S.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "user_id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      status: {
        type: S.ENUM(
          "Pending",
          "Reserved",
          "Shipped",
          "Delivered",
          "Cancelled",
          "Returned"
        ),
        defaultValue: "Pending",
      },
      orderDateTime: {
        type: S.DATE,
        defaultValue: S.fn("NOW"),
        allowNull: false,
      },
      totalAmount: { type: S.DECIMAL(10, 2), defaultValue: 0 },
      pickupOrDelivery: {
        type: S.ENUM("Pickup", "Delivery"),
        defaultValue: "Pickup",
      },
      pickupStoreID: {
        type: S.INTEGER,
        references: { model: "Stores", key: "store_id" },
        onUpdate: "SET NULL",
        onDelete: "SET NULL",
      },
      shippingAddress: { type: S.STRING },
      reservedAt: { type: S.DATE },
      createdAt: { type: S.DATE, defaultValue: S.fn("NOW"), allowNull: false },
      updatedAt: { type: S.DATE, defaultValue: S.fn("NOW"), allowNull: false },
    });
    await q.addIndex("Orders", ["user_id"]);
  },
  async down(q) {
    await q.dropTable("Orders");
    await q.sequelize.query("DROP TYPE IF EXISTS `enum_Orders_status`");
    await q.sequelize.query(
      "DROP TYPE IF EXISTS `enum_Orders_pickupOrDelivery`"
    );
  },
};
