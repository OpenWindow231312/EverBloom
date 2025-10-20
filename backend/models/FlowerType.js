module.exports = (sequelize, DataTypes) => {
  const FlowerType = sequelize.define(
    "FlowerType",
    {
      type_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      type_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      default_shelf_life: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
      },
      updatedAt: {
        type: DataTypes.DATE,
      },
    },
    {
      tableName: "FlowerTypes",
      timestamps: true,
    }
  );

  return FlowerType;
};
