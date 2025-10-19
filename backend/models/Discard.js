// ========================================
// 🌸 EverBloom — Discard Model (Fixed)
// ========================================
module.exports = (sequelize, DataTypes) => {
  const Discard = sequelize.define(
    "Discard",
    {
      discard_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      harvestBatch_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantityDiscarded: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      reason: {
        type: DataTypes.STRING,
      },
      discardDateTime: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      discardedByEmployeeID: {
        type: DataTypes.INTEGER,
        allowNull: true, // optional
      },
    },
    {
      tableName: "Discards", // ✅ ensures Sequelize uses correct plural
      timestamps: true,
    }
  );

  return Discard;
};
