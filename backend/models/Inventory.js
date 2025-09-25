module.exports = (sequelize, DataTypes) =>
  sequelize.define("Inventory", {
    inventory_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    harvestBatch_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    stemsInColdroom: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    lastUpdated: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  });
