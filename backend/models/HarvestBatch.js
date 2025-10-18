// ========================================
// 🌸 EverBloom — HarvestBatch Model
// ========================================
module.exports = (sequelize, DataTypes) => {
  const HarvestBatch = sequelize.define(
    "HarvestBatch",
    {
      harvestBatch_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      flower_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      harvestDateTime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      totalStemsHarvested: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(
          "InColdroom",
          "PartiallyShipped",
          "ShippedOut",
          "Discarded"
        ),
        allowNull: false,
        defaultValue: "InColdroom",
      },
      harvestedByEmployeeID: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "HarvestBatches",
      timestamps: true,
    }
  );

  return HarvestBatch;
};
