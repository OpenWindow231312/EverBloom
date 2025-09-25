module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define("Role", {
    role_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    roleName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // optional but good for roles
    },
  });

  Role.associate = (models) => {
    Role.belongsToMany(models.User, {
      through: models.UserRole,
      foreignKey: "role_id",
    });
  };

  return Role;
};
