module.exports = (sequelize, DataTypes) =>
  sequelize.define("OrderItem", {
    orderItem_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    order_id: { type: DataTypes.INTEGER, allowNull: false },
    flower_id: { type: DataTypes.INTEGER, allowNull: false },
    quantityOrdered: { type: DataTypes.INTEGER, allowNull: false },
    unitPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    discountApplied: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    reservationStatus: {
      type: DataTypes.ENUM("Reserved", "Fulfilled", "Cancelled"),
      defaultValue: "Reserved",
    },
    reservedQuantity: { type: DataTypes.INTEGER, defaultValue: 0 },
  });
