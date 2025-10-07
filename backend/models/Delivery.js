module.exports = (sequelize, DataTypes) => {
  const Delivery = sequelize.define("Delivery", {
    delivery_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    order_id: { type: DataTypes.INTEGER, allowNull: false },
    assignedToUserID: { type: DataTypes.INTEGER },
    driverName: DataTypes.STRING,
    vehicle: DataTypes.STRING,
    contactNumber: DataTypes.STRING,
    deliveryType: {
      type: DataTypes.ENUM("Pickup", "Delivery"),
      defaultValue: "Delivery",
    },
    deliveryDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    status: {
      type: DataTypes.ENUM("Scheduled", "In Transit", "Delivered", "Failed"),
      defaultValue: "Scheduled",
    },
    proofOfDeliveryURL: DataTypes.STRING,
    notes: DataTypes.TEXT,
  });
  Delivery.associate = (models) => {
    Delivery.belongsTo(models.Order, { foreignKey: "order_id" });
    Delivery.belongsTo(models.User, { foreignKey: "assignedToUserID" });
  };
  return Delivery;
};
