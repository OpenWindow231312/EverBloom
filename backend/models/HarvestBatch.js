// ========================================
// 🌸 EverBloom — HarvestBatch Model (Fixed with associations + expiryDate)
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
      expiryDate: {
        type: DataTypes.DATE,
        allowNull: true,
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

  // ===========================
  // 🌿 Associations
  // ===========================
  HarvestBatch.associate = (models) => {
    HarvestBatch.belongsTo(models.Flower, {
      foreignKey: "flower_id",
      as: "Flower",
      onDelete: "CASCADE",
    });

    HarvestBatch.hasOne(models.Inventory, {
      foreignKey: "harvestBatch_id",
      as: "Inventory",
      onDelete: "CASCADE",
    });
  };

  // // ===========================
  // // 🪄 Auto-create inventory after harvest
  // // ===========================
  // HarvestBatch.afterCreate(async (batch, options) => {
  //   const db = batch.sequelize.models;
  //   await db.Inventory.create({
  //     harvestBatch_id: batch.harvestBatch_id,
  //     stemsInColdroom: batch.totalStemsHarvested,
  //     lastUpdated: new Date(),
  //   });
  // });

  return HarvestBatch;
};
