// ========================================
// 🌸 EverBloom — Review Model (Updated for Flower Reviews)
// ========================================
module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define("Review", {
    review_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    flower_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Flowers',
        key: 'flower_id'
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'user_id'
      }
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5,
      validate: { min: 1, max: 5 }
    },
    heading: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  });

  Review.associate = (models) => {
    Review.belongsTo(models.Flower, { foreignKey: "flower_id" });
    Review.belongsTo(models.User, { foreignKey: "user_id" });
  };

  return Review;
};
