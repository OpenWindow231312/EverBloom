module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fullName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  });

  User.associate = (models) => {
    // A user can have many roles
    User.belongsToMany(models.Role, {
      through: models.UserRole,
      foreignKey: "user_id",
    });

    // Optional: if you want direct access to UserRoles
    User.hasMany(models.UserRole, {
      foreignKey: "user_id",
    });
  };

  return User;
};
