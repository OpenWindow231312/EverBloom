// 🌸 EverBloom — Flower Seeder (Safe Upsert Version)
require("dotenv").config();
const { sequelize, Flower, FlowerType } = require("../models");

(async () => {
  try {
    console.log("⏳ Connecting to database...");
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");

    const types = await FlowerType.findAll();
    if (!types.length) {
      console.error("❌ No FlowerTypes found. Run the type seeder first!");
      process.exit(1);
    }

    const typeMap = {};
    types.forEach((t) => (typeMap[t.type_name] = t.type_id));
    console.log("📘 Type Map:", typeMap);

    const flowers = [
      // Roses
      {
        variety: "Red Naomi",
        color: "Red",
        stem_length: 60,
        shelf_life: 7,
        type: "Rose",
      },
      {
        variety: "Avalanche",
        color: "White",
        stem_length: 55,
        shelf_life: 7,
        type: "Rose",
      },
      {
        variety: "Freedom",
        color: "Deep Red",
        stem_length: 50,
        shelf_life: 7,
        type: "Rose",
      },
      // Tulips
      {
        variety: "Queen of Night",
        color: "Purple",
        stem_length: 40,
        shelf_life: 5,
        type: "Tulip",
      },
      {
        variety: "Yellow Emperor",
        color: "Yellow",
        stem_length: 35,
        shelf_life: 5,
        type: "Tulip",
      },
      // Lilies
      {
        variety: "Stargazer",
        color: "Pink",
        stem_length: 50,
        shelf_life: 6,
        type: "Lily",
      },
      {
        variety: "Casablanca",
        color: "White",
        stem_length: 55,
        shelf_life: 6,
        type: "Lily",
      },
      // Daisies
      {
        variety: "Gerbera Daisy",
        color: "Orange",
        stem_length: 45,
        shelf_life: 5,
        type: "Daisy",
      },
      {
        variety: "Snowball Daisy",
        color: "White",
        stem_length: 40,
        shelf_life: 5,
        type: "Daisy",
      },
      // Sunflowers
      {
        variety: "Classic Giant",
        color: "Yellow",
        stem_length: 70,
        shelf_life: 8,
        type: "Sunflower",
      },
      // Orchids
      {
        variety: "Phalaenopsis",
        color: "White",
        stem_length: 60,
        shelf_life: 10,
        type: "Orchid",
      },
      {
        variety: "Cymbidium",
        color: "Green",
        stem_length: 50,
        shelf_life: 10,
        type: "Orchid",
      },
      // Proteas
      {
        variety: "King Protea",
        color: "Pink",
        stem_length: 60,
        shelf_life: 12,
        type: "Protea",
      },
      {
        variety: "Blushing Bride",
        color: "Soft Pink",
        stem_length: 50,
        shelf_life: 12,
        type: "Protea",
      },
    ];

    for (const f of flowers) {
      const type_id = typeMap[f.type];
      if (!type_id) {
        console.warn(`⚠️ Skipping ${f.variety} — no type found for ${f.type}`);
        continue;
      }

      await Flower.upsert({
        variety: f.variety,
        color: f.color,
        stem_length: f.stem_length,
        shelf_life: f.shelf_life,
        type_id,
        updatedAt: new Date(),
      });

      console.log(`🌷 Added/Updated: ${f.variety} (${f.color})`);
    }

    console.log("🌺 All flower varieties upserted successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding flowers:", err);
    process.exit(1);
  }
})();
