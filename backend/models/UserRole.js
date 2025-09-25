module.exports = (sequelize, DataTypes) =>
  sequelize.define("UserRole", {
    userRole_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    role_id: { type: DataTypes.INTEGER, allowNull: false },
  });
