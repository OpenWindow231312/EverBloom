module.exports = (sequelize, DataTypes) => {
  const UserRole = sequelize.define("UserRole", {
    userRole_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    role_id: { type: DataTypes.INTEGER, allowNull: false },
  });

  UserRole.associate = (models) => {
    // Each UserRole belongs to a User
    UserRole.belongsTo(models.User, { foreignKey: "user_id" });

    // Each UserRole belongs to a Role
    UserRole.belongsTo(models.Role, { foreignKey: "role_id" });
  };

  return UserRole;
};
