module.exports = (sequelize, DataTypes) =>
  sequelize.define("ColdroomReservation", {
    reservation_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    orderItem_id: { type: DataTypes.INTEGER, allowNull: false },
    harvestBatch_id: { type: DataTypes.INTEGER, allowNull: false },
    quantityReserved: { type: DataTypes.INTEGER, allowNull: false },
    reservedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    status: {
      type: DataTypes.ENUM("Active", "Released", "Fulfilled"),
      defaultValue: "Active",
    },
  });
