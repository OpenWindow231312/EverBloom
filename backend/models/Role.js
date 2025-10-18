// ========================================
// 🌸 EverBloom — Role Model (Factory Style)
// ========================================
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    "Role",
    {
      role_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      roleName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // ensures no duplicate roles
      },
    },
    {
      tableName: "Roles",
      timestamps: false,
    }
  );

  return Role;
};
