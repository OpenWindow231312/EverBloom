// ========================================
// 🌸 EverBloom — Favourite Model
// Stores user-specific favourite flowers
// ========================================

module.exports = (sequelize, DataTypes) => {
  const Favourite = sequelize.define(
    "Favourite",
    {
      favourite_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "user_id",
        },
      },
      flower_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Flowers",
          key: "flower_id",
        },
      },
    },
    {
      tableName: "Favourites",
      timestamps: true,
    }
  );

  Favourite.associate = (models) => {
    Favourite.belongsTo(models.User, {
      foreignKey: "user_id",
      onDelete: "CASCADE",
    });
    Favourite.belongsTo(models.Flower, {
      foreignKey: "flower_id",
      onDelete: "CASCADE",
    });
  };

  return Favourite;
};
