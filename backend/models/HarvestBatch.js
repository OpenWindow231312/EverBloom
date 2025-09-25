module.exports = (sequelize, DataTypes) =>
  sequelize.define("HarvestBatch", {
    harvestBatch_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    flower_id: { type: DataTypes.INTEGER, allowNull: false },
    harvestDateTime: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    totalStemsHarvested: { type: DataTypes.INTEGER, allowNull: false },
    status: {
      type: DataTypes.ENUM(
        "InColdroom",
        "PartiallyShipped",
        "ShippedOut",
        "Discarded"
      ),
      defaultValue: "InColdroom",
    },
    harvestedByEmployeeID: { type: DataTypes.INTEGER },
    notes: { type: DataTypes.TEXT },
  });
