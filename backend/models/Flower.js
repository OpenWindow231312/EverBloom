// ========================================
// 🌸 EverBloom — Flower Model
// ========================================
module.exports = (sequelize, DataTypes) =>
  sequelize.define("Flower", {
    flower_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    variety: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING,
    },
    stem_length: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    shelf_life: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    unit: {
      type: DataTypes.STRING,
      defaultValue: "stem",
    },
    notes: {
      type: DataTypes.TEXT,
    },

    // 💰 Pricing
    price_per_stem: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    sale_price_per_stem: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },

    // 🪷 Description & Image
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // 🏷️ Status Flags
    is_listed_for_sale: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    is_on_sale: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });
