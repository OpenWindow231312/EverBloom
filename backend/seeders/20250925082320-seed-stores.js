"use strict";
module.exports = {
  async up(q) {
    await q.bulkInsert("Stores", [
      {
        store_name: "EverBloom Farm Gate",
        isOnline: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  async down(q) {
    await q.bulkDelete("Stores", null, {});
  },
};
