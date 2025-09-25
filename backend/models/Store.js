module.exports = (sequelize, DataTypes) =>
  sequelize.define("Store", {
    store_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    store_name: { type: DataTypes.STRING, allowNull: false },
    storeLocation: { type: DataTypes.STRING },
    address: { type: DataTypes.STRING },
    isOnline: { type: DataTypes.BOOLEAN, defaultValue: false },
    contact: { type: DataTypes.STRING },
  });
