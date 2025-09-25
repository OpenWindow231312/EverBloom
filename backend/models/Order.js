module.exports = (sequelize, DataTypes) =>
  sequelize.define("Order", {
    order_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    status: {
      type: DataTypes.ENUM(
        "Pending",
        "Reserved",
        "Shipped",
        "Delivered",
        "Cancelled",
        "Returned"
      ),
      defaultValue: "Pending",
    },
    orderDateTime: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    totalAmount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    pickupOrDelivery: {
      type: DataTypes.ENUM("Pickup", "Delivery"),
      defaultValue: "Pickup",
    },
    pickupStoreID: { type: DataTypes.INTEGER },
    shippingAddress: { type: DataTypes.STRING },
    reservedAt: { type: DataTypes.DATE },
  });
