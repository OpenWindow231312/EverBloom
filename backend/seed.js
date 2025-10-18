// ==========================================
// 🌸 EverBloom — Database Seeder (Unified)
// ==========================================
require("dotenv").config();
const bcrypt = require("bcryptjs");
const {
  sequelize,
  Role,
  UserRole,
  User,
  Flower,
  FlowerType,
  Store,
  HarvestBatch,
  Inventory,
} = require("./models");

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to DB");

    // 🌼 Seed Roles
    const roles = ["Admin", "Employee", "Florist", "Customer"];
    for (const roleName of roles) {
      await Role.findOrCreate({ where: { roleName } });
    }
    console.log("✅ Roles ready");

    // 👤 Ensure Admin User Exists
    const email = "admin@everbloom.com";
    const password = "Admin123!";
    const passwordHash = await bcrypt.hash(password, 10);

    const [adminUser, createdAdmin] = await User.findOrCreate({
      where: { email },
      defaults: {
        fullName: "Admin User",
        email,
        passwordHash,
        isActive: true,
      },
    });

    console.log(
      createdAdmin
        ? `🌱 Created Admin account (${email})`
        : `ℹ️ Admin account already exists (${email})`
    );

    // 🔗 Link Admin user to Admin role
    const adminRole = await Role.findOne({ where: { roleName: "Admin" } });
    const existingLink = await UserRole.findOne({
      where: { user_id: adminUser.user_id, role_id: adminRole.role_id },
    });
    if (!existingLink) {
      await UserRole.create({
        user_id: adminUser.user_id,
        role_id: adminRole.role_id,
      });
      console.log("🔗 Linked Admin user to Admin role");
    }

    // 🌷 Seed Flower Types
    const [roseType] = await FlowerType.findOrCreate({
      where: { type_name: "Rose" },
      defaults: {
        default_shelf_life: 7,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // 🌹 Seed Flowers
    const [flower] = await Flower.findOrCreate({
      where: { variety: "Red Naomi" },
      defaults: {
        type_id: roseType.type_id,
        color: "Red",
        stem_length: 50,
        shelf_life: 7,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // 🏬 Seed Store
    const [store] = await Store.findOrCreate({
      where: { store_name: "EverBloom HQ" },
      defaults: {
        storeLocation: "Pretoria East",
        address: "123 Flower Rd",
        isOnline: true,
        contact: "0123456789",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // 🌾 Seed Harvest Batch
    const [batch] = await HarvestBatch.findOrCreate({
      where: { flower_id: flower.flower_id },
      defaults: {
        harvestDateTime: new Date(),
        totalStemsHarvested: 120,
        status: "InColdroom",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // 🧺 Seed Inventory
    await Inventory.findOrCreate({
      where: { harvestBatch_id: batch.harvestBatch_id },
      defaults: {
        stemsInColdroom: 120,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    console.log("🌸 Database successfully seeded!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
})();
