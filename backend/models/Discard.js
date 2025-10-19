// ========================================
// 🌸 EverBloom — Discard Model
// ========================================
module.exports = (sequelize, DataTypes) => {
  const Discard = sequelize.define(
    "Discard",
    {
      discard_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      harvestBatch_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "HarvestBatches",
          key: "harvestBatch_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      quantityDiscarded: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      reason: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },

      discardDateTime: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },

      movedToArchiveDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      discardedByEmployeeID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Users",
          key: "user_id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
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
      tableName: "Discards",
      timestamps: true,
      freezeTableName: true,
    }
  );

  // ===============================
  // 🌿 Associations
  // ===============================
  Discard.associate = (models) => {
    Discard.belongsTo(models.HarvestBatch, {
      as: "HarvestBatch",
      foreignKey: "harvestBatch_id",
    });

    Discard.belongsTo(models.User, {
      as: "DiscardedBy",
      foreignKey: "discardedByEmployeeID",
    });
  };

  return Discard;
};
