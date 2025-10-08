"use strict";
const fs = require("fs");
const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require("../config/config.json")[env];

// ===============================
// 🔹 Initialize Sequelize
// ===============================
const sequelize = new Sequelize(
  process.env.DB_NAME || config.database,
  process.env.DB_USER || config.username,
  process.env.DB_PASS || config.password,
  {
    host: process.env.DB_HOST || config.host,
    port: process.env.DB_PORT || config.port || 3306,
    dialect: "mysql",
    logging: false,
    dialectOptions: {
      connectTimeout: 60000, // avoids Render timeout errors
    },
  }
);

// ===============================
// 🔹 Load models dynamically
// ===============================
const db = {};
fs.readdirSync(__dirname)
  .filter((file) => file !== basename && file.endsWith(".js"))
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

// ===============================
// 🔹 Associations
// ===============================
const {
  User,
  Role,
  UserRole,
  FlowerType,
  Flower,
  HarvestBatch,
  Inventory,
  Store,
  Order,
  OrderItem,
  ColdroomReservation,
  Discard,
  Review, // include Review if you plan to use it in dashboard stats
} = db;

// Users & Roles (many-to-many through UserRole)
if (User && Role && UserRole) {
  User.belongsToMany(Role, { through: UserRole, foreignKey: "user_id" });
  Role.belongsToMany(User, { through: UserRole, foreignKey: "role_id" });

  User.hasMany(UserRole, { foreignKey: "user_id" });
  UserRole.belongsTo(User, { foreignKey: "user_id" });

  Role.hasMany(UserRole, { foreignKey: "role_id" });
  UserRole.belongsTo(Role, { foreignKey: "role_id" });

  User.hasMany(Order, { foreignKey: "user_id" });
  Order.belongsTo(User, { foreignKey: "user_id" });
}

// FlowerType ↔ Flower
if (FlowerType && Flower) {
  FlowerType.hasMany(Flower, { foreignKey: "type_id" });
  Flower.belongsTo(FlowerType, { foreignKey: "type_id" });
}

// Flower ↔ HarvestBatch
if (Flower && HarvestBatch) {
  Flower.hasMany(HarvestBatch, { foreignKey: "flower_id" });
  HarvestBatch.belongsTo(Flower, { foreignKey: "flower_id" });
}

// HarvestBatch ↔ Inventory
if (HarvestBatch && Inventory) {
  HarvestBatch.hasOne(Inventory, { foreignKey: "harvestBatch_id" });
  Inventory.belongsTo(HarvestBatch, { foreignKey: "harvestBatch_id" });
}

// Order ↔ OrderItem
if (Order && OrderItem) {
  Order.hasMany(OrderItem, { foreignKey: "order_id" });
  OrderItem.belongsTo(Order, { foreignKey: "order_id" });
}

// Flower ↔ OrderItem
if (Flower && OrderItem) {
  Flower.hasMany(OrderItem, { foreignKey: "flower_id" });
  OrderItem.belongsTo(Flower, { foreignKey: "flower_id" });
}

// Store ↔ Order
if (Order && Store) {
  Store.hasMany(Order, { foreignKey: "pickupStoreID" });
  Order.belongsTo(Store, { foreignKey: "pickupStoreID" });
}

// OrderItem / HarvestBatch ↔ ColdroomReservation
if (OrderItem && HarvestBatch && ColdroomReservation) {
  OrderItem.hasMany(ColdroomReservation, { foreignKey: "orderItem_id" });
  ColdroomReservation.belongsTo(OrderItem, { foreignKey: "orderItem_id" });

  HarvestBatch.hasMany(ColdroomReservation, { foreignKey: "harvestBatch_id" });
  ColdroomReservation.belongsTo(HarvestBatch, {
    foreignKey: "harvestBatch_id",
  });
}

// HarvestBatch / User ↔ Discard
if (HarvestBatch && Discard && User) {
  HarvestBatch.hasMany(Discard, { foreignKey: "harvestBatch_id" });
  Discard.belongsTo(HarvestBatch, { foreignKey: "harvestBatch_id" });

  Discard.belongsTo(User, {
    foreignKey: "discardedByEmployeeID",
    as: "discardedBy",
  });
}

// ===============================
// 🔹 Sync / Test Connection
// ===============================
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established.");

    // Only use { alter: true } in dev. Remove in production.
    if (process.env.NODE_ENV === "development") {
      await sequelize.sync({ alter: true });
      console.log("✅ Models synchronized with database.");
    }
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
})();

// ===============================
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
