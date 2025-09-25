"use strict";
module.exports = {
  async up(q) {
    await q.bulkInsert("Roles", [
      { roleName: "Admin", createdAt: new Date(), updatedAt: new Date() },
      { roleName: "Employee", createdAt: new Date(), updatedAt: new Date() },
      { roleName: "Customer", createdAt: new Date(), updatedAt: new Date() },
      { roleName: "Florist", createdAt: new Date(), updatedAt: new Date() },
    ]);
  },
  async down(q) {
    await q.bulkDelete("Roles", null, {});
  },
};
