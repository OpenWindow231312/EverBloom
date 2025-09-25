"use strict";
module.exports = {
  async up(q) {
    // ensure user exists (insert only if missing)
    const [u1] = await q.sequelize.query(
      "SELECT user_id FROM Users WHERE email='test@everbloom.local' LIMIT 1;"
    );

    if (!u1.length) {
      await q.bulkInsert(
        "Users",
        [
          {
            fullName: "Test Customer",
            email: "test@everbloom.local",
            passwordHash: "dev", // placeholder
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        {}
      );
    }

    const [u2] = await q.sequelize.query(
      "SELECT user_id FROM Users WHERE email='test@everbloom.local' LIMIT 1;"
    );
    const userId = u2[0].user_id;

    // ensure Customer role exists
    const [r1] = await q.sequelize.query(
      "SELECT role_id FROM Roles WHERE roleName='Customer' LIMIT 1;"
    );
    let roleId = r1.length ? r1[0].role_id : null;

    if (!roleId) {
      await q.bulkInsert(
        "Roles",
        [
          {
            roleName: "Customer",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        {}
      );
      const [r2] = await q.sequelize.query(
        "SELECT role_id FROM Roles WHERE roleName='Customer' LIMIT 1;"
      );
      roleId = r2[0].role_id;
    }

    // ensure mapping exists
    const [m1] = await q.sequelize.query(
      "SELECT userRole_id FROM UserRoles WHERE user_id=? AND role_id=? LIMIT 1;",
      { replacements: [userId, roleId] }
    );

    if (!m1.length) {
      await q.bulkInsert(
        "UserRoles",
        [
          {
            user_id: userId,
            role_id: roleId,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        {}
      );
    }
  },

  async down(q) {
    await q.bulkDelete("UserRoles", null, {});
    await q.bulkDelete("Users", { email: "test@everbloom.local" }, {});
  },
};
