// 🌸 EverBloom — Seed Flower Types
require("dotenv").config();
const { sequelize, FlowerType } = require("../models");

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to database");

    const flowerTypes = [
      { type_name: "Rose", default_shelf_life: 7 },
      { type_name: "Tulip", default_shelf_life: 5 },
      { type_name: "Lily", default_shelf_life: 6 },
      { type_name: "Orchid", default_shelf_life: 11 },
      { type_name: "Sunflower", default_shelf_life: 8 },
      { type_name: "Daisy", default_shelf_life: 5 },
      { type_name: "Peony", default_shelf_life: 7 },
      { type_name: "Hydrangea", default_shelf_life: 6 },
      { type_name: "Carnation", default_shelf_life: 10 },
      { type_name: "Protea", default_shelf_life: 12 },
      { type_name: "Ranunculus", default_shelf_life: 5 },
      { type_name: "Anemone", default_shelf_life: 6 },
      { type_name: "Snapdragon", default_shelf_life: 7 },
      { type_name: "Dahlia", default_shelf_life: 4 },
      { type_name: "Freesia", default_shelf_life: 10 },
      { type_name: "Chrysanthemum", default_shelf_life: 12 },
      { type_name: "Zinnia", default_shelf_life: 10 },
      { type_name: "Alstroemeria", default_shelf_life: 10 },
    ];

    for (const type of flowerTypes) {
      await FlowerType.findOrCreate({
        where: { type_name: type.type_name },
        defaults: {
          default_shelf_life: type.default_shelf_life,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    console.log("🌼 Flower types seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding flower types:", err);
    process.exit(1);
  }
})();
