module.exports = (sequelize, DataTypes) =>
  sequelize.define("Discard", {
    discard_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    harvestBatch_id: { type: DataTypes.INTEGER, allowNull: false },
    quantityDiscarded: { type: DataTypes.INTEGER, allowNull: false },
    reason: { type: DataTypes.STRING },
    discardDateTime: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    discardedByEmployeeID: { type: DataTypes.INTEGER },
  });
