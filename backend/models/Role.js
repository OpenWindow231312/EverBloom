module.exports = (sequelize, DataTypes) =>
  sequelize.define("Role", {
    role_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    roleName: { type: DataTypes.STRING, allowNull: false },
  });
