"use strict";
const bcrypt = require("bcryptjs");

module.exports = {
  async up(q) {
    // ensure Admin role exists
    const [r1] = await q.sequelize.query(
      "SELECT role_id FROM Roles WHERE roleName='Admin' LIMIT 1;"
    );
    let adminRoleId = r1.length ? r1[0].role_id : null;
    if (!adminRoleId) {
      await q.bulkInsert("Roles", [
        { roleName: "Admin", createdAt: new Date(), updatedAt: new Date() },
      ]);
      const [r2] = await q.sequelize.query(
        "SELECT role_id FROM Roles WHERE roleName='Admin' LIMIT 1;"
      );
      adminRoleId = r2[0].role_id;
    }

    const email = "admin@everbloom.local";
    const hash = await bcrypt.hash("Admin@123", 10);

    // upsert admin user; if exists in plain text, hash it
    const [u] = await q.sequelize.query(
      "SELECT user_id, passwordHash FROM Users WHERE email=? LIMIT 1;",
      { replacements: [email] }
    );

    if (!u.length) {
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
    } else {
      const { user_id, passwordHash } = u[0];
      const alreadyHashed = String(passwordHash || "").startsWith("$2");
      if (!alreadyHashed) {
        await q.sequelize.query(
          "UPDATE Users SET passwordHash=?, updatedAt=? WHERE user_id=?",
          { replacements: [hash, new Date(), user_id] }
        );
      }
    }

    // ensure mapping user↔Admin role
    const [u2] = await q.sequelize.query(
      "SELECT user_id FROM Users WHERE email=? LIMIT 1;",
      { replacements: [email] }
    );
    const userId = u2[0].user_id;

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
