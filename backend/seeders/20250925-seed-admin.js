"use strict";
const bcrypt = require("bcryptjs");
module.exports = {
  async up(q) {
    // ensure Admin role
    const [roles] = await q.sequelize.query(
      "SELECT role_id FROM Roles WHERE roleName='Admin' LIMIT 1;"
    );
    let adminRoleId = roles.length ? roles[0].role_id : null;
    if (!adminRoleId) {
      await q.bulkInsert("Roles", [
        { roleName: "Admin", createdAt: new Date(), updatedAt: new Date() },
      ]);
      const [r2] = await q.sequelize.query(
        "SELECT role_id FROM Roles WHERE roleName='Admin' LIMIT 1;"
      );
      adminRoleId = r2[0].role_id;
    }

    // upsert admin user
    const email = "admin@everbloom.local";
    const [u] = await q.sequelize.query(
      "SELECT user_id FROM Users WHERE email=? LIMIT 1;",
      { replacements: [email] }
    );
    let userId = u.length ? u[0].user_id : null;
    if (!userId) {
      const hash = await bcrypt.hash("Admin@123", 10);
      await q.bulkInsert("Users", [
        {
          fullName: "Admin",
          email,
          passwordHash: hash,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
      const [u2] = await q.sequelize.query(
        "SELECT user_id FROM Users WHERE email=? LIMIT 1;",
        { replacements: [email] }
      );
      userId = u2[0].user_id;
    }

    // ensure mapping
    const [m] = await q.sequelize.query(
      "SELECT userRole_id FROM UserRoles WHERE user_id=? AND role_id=? LIMIT 1;",
      { replacements: [userId, adminRoleId] }
    );
    if (!m.length) {
      await q.bulkInsert("UserRoles", [
        {
          user_id: userId,
          role_id: adminRoleId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    }
  },
  async down(q) {
    await q.bulkDelete("UserRoles", null, {});
    await q.bulkDelete("Users", { email: "admin@everbloom.local" }, {});
  },
};
