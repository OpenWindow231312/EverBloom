// ========================================
// 🌸 EverBloom — Role Seeder (Fixed)
// ========================================
require("dotenv").config();
const { Sequelize } = require("sequelize");
const { Role } = require("../models");

async function seedRoles() {
  try {
    // Ensure DB connection
    const sequelize = new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASS,
      {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT || "mysql",
        logging: false,
      }
    );

    await sequelize.authenticate();
    console.log("✅ Database connection established");

    // Ensure Role model is ready
    await Role.sync();

    const roles = ["Admin", "Employee", "Florist", "Customer"];
    for (const roleName of roles) {
      const [role, created] = await Role.findOrCreate({
        where: { roleName },
        defaults: { roleName },
      });
      console.log(
        created ? `✅ Created role: ${roleName}` : `ℹ️ Role exists: ${roleName}`
      );
    }

    console.log("🌿 Role seeding complete!");
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding roles:", error.message);
    process.exit(1);
  }
}

seedRoles();
