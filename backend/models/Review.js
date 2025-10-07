module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define("Review", {
    review_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    order_id: { type: DataTypes.INTEGER, allowNull: false },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    rating: { type: DataTypes.INTEGER, validate: { min: 1, max: 5 } },
    comment: DataTypes.TEXT,
  });
  Review.associate = (models) => {
    Review.belongsTo(models.Order, { foreignKey: "order_id" });
    Review.belongsTo(models.User, { foreignKey: "user_id" });
  };
  return Review;
};
