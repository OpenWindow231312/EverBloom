// ==========================================
// 🌸 EverBloom — Database Seeder
// ==========================================
require("dotenv").config();
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
    const [adminRole] = await Role.findOrCreate({
      where: { roleName: "Admin" },
    });
    const [employeeRole] = await Role.findOrCreate({
      where: { roleName: "Employee" },
    });
    const [customerRole] = await Role.findOrCreate({
      where: { roleName: "Customer" },
    });
    console.log("✅ Roles ready");

    // 👤 Find existing admin user
    const adminUser = await User.findOne({
      where: { email: "admin@everbloom.local" },
    });
    if (adminUser) {
      await UserRole.findOrCreate({
        where: { user_id: adminUser.user_id, role_id: adminRole.role_id },
      });
      console.log("✅ Linked Admin user to Admin role");
    } else {
      console.log(
        "⚠️ No admin user found — register one first via /api/auth/register"
      );
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
