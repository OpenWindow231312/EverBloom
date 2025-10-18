// ========================================
// 🌸 EverBloom — Admin Seeder
// ========================================
require("dotenv").config();
const bcrypt = require("bcryptjs");
const { Sequelize } = require("sequelize");
const { User, Role, UserRole } = require("../models");

async function seedAdminUser() {
  try {
    // ✅ Connect manually to the DB (same as in seedRoles.js)
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

    // ✅ Ensure Roles exist
    const [adminRole] = await Role.findOrCreate({
      where: { roleName: "Admin" },
      defaults: { roleName: "Admin" },
    });

    // ✅ Create Admin User if missing
    const email = "admin@everbloom.com";
    const password = "Admin123!";

    const passwordHash = await bcrypt.hash(password, 10);

    const [adminUser, created] = await User.findOrCreate({
      where: { email },
      defaults: {
        fullName: "Admin User",
        email,
        passwordHash,
        isActive: true,
      },
    });

    console.log(
      created
        ? `✅ Created Admin account (${email})`
        : `ℹ️ Admin user already exists (${email})`
    );

    // ✅ Link to Admin role if not already linked
    const existingLink = await UserRole.findOne({
      where: { user_id: adminUser.user_id, role_id: adminRole.role_id },
    });

    if (!existingLink) {
      await UserRole.create({
        user_id: adminUser.user_id,
        role_id: adminRole.role_id,
      });
      console.log("🔗 Linked Admin user to Admin role");
    } else {
      console.log("ℹ️ Admin already linked to role");
    }

    console.log("🌿 Admin seeding complete!");
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding admin user:", error);
    process.exit(1);
  }
}

seedAdminUser();
