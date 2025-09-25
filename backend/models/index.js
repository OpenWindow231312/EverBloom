"use strict";
const fs = require("fs");
const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require("../config/config.json")[env];

const sequelize = new Sequelize(
  process.env.DB_NAME || config.database,
  process.env.DB_USER || config.username,
  process.env.DB_PASS || config.password,
  { host: process.env.DB_HOST || config.host, dialect: "mysql", logging: false }
);

const db = {};
fs.readdirSync(__dirname)
  .filter((file) => file !== basename && file.endsWith(".js"))
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

// Associations
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
} = db;

if (User && Role && UserRole) {
  User.belongsToMany(Role, { through: UserRole, foreignKey: "user_id" });
  Role.belongsToMany(User, { through: UserRole, foreignKey: "role_id" });
  User.hasMany(Order, { foreignKey: "user_id" });
}

if (FlowerType && Flower) {
  FlowerType.hasMany(Flower, { foreignKey: "type_id" });
  Flower.belongsTo(FlowerType, { foreignKey: "type_id" });
}

if (Flower && HarvestBatch) {
  Flower.hasMany(HarvestBatch, { foreignKey: "flower_id" });
  HarvestBatch.belongsTo(Flower, { foreignKey: "flower_id" });
}

if (HarvestBatch && Inventory) {
  HarvestBatch.hasOne(Inventory, { foreignKey: "harvestBatch_id" });
  Inventory.belongsTo(HarvestBatch, { foreignKey: "harvestBatch_id" });
}

if (Order && OrderItem) {
  Order.hasMany(OrderItem, { foreignKey: "order_id" });
  OrderItem.belongsTo(Order, { foreignKey: "order_id" });
}

if (Flower && OrderItem) {
  Flower.hasMany(OrderItem, { foreignKey: "flower_id" });
  OrderItem.belongsTo(Flower, { foreignKey: "flower_id" });
}

if (Order && Store) {
  Store.hasMany(Order, { foreignKey: "pickupStoreID" });
  Order.belongsTo(Store, { foreignKey: "pickupStoreID" });
}

if (OrderItem && HarvestBatch && ColdroomReservation) {
  OrderItem.hasMany(ColdroomReservation, { foreignKey: "orderItem_id" });
  ColdroomReservation.belongsTo(OrderItem, { foreignKey: "orderItem_id" });
  HarvestBatch.hasMany(ColdroomReservation, { foreignKey: "harvestBatch_id" });
  ColdroomReservation.belongsTo(HarvestBatch, {
    foreignKey: "harvestBatch_id",
  });
}

if (HarvestBatch && Discard && User) {
  HarvestBatch.hasMany(Discard, { foreignKey: "harvestBatch_id" });
  Discard.belongsTo(HarvestBatch, { foreignKey: "harvestBatch_id" });
  Discard.belongsTo(User, {
    foreignKey: "discardedByEmployeeID",
    as: "discardedBy",
  });
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;
