// ========================================
// 🌸 EverBloom — Inventory Model (Linked to HarvestBatch)
// ========================================
module.exports = (sequelize, DataTypes) => {
  const Inventory = sequelize.define(
    "Inventory",
    {
      inventory_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      harvestBatch_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      stemsInColdroom: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      lastUpdated: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "Inventories",
      timestamps: true,
    }
  );

  // ===========================
  // 🌿 Associations
  // ===========================
  Inventory.associate = (models) => {
    Inventory.belongsTo(models.HarvestBatch, {
      foreignKey: "harvestBatch_id",
      as: "HarvestBatch",
      onDelete: "CASCADE",
    });
  };

  return Inventory;
};
