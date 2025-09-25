module.exports = (sequelize, DataTypes) =>
  sequelize.define("Flower", {
    flower_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    type_id: { type: DataTypes.INTEGER },
    variety: { type: DataTypes.STRING, allowNull: false },
    color: { type: DataTypes.STRING },
    stem_length: { type: DataTypes.FLOAT },
    shelf_life: { type: DataTypes.INTEGER },
    unit: { type: DataTypes.STRING, defaultValue: "stem" },
    notes: { type: DataTypes.TEXT },
  });
