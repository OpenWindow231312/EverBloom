module.exports = (sequelize, DataTypes) =>
  sequelize.define("FlowerType", {
    type_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    type_name: { type: DataTypes.STRING, allowNull: false },
    default_shelf_life: { type: DataTypes.INTEGER },
    notes: { type: DataTypes.TEXT },
  });
