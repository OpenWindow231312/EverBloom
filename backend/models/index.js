// ========================================
// 🌸 EverBloom — Sequelize Model Loader (Factory Pattern)
// ========================================
const { DataTypes } = require("sequelize");
const sequelize = require("../db");

// ✅ Import model factory functions and call them
const User = require("./User")(sequelize, DataTypes);
const Role = require("./Role")(sequelize, DataTypes);
const UserRole = require("./UserRole")(sequelize, DataTypes);
const Flower = require("./Flower")(sequelize, DataTypes);
const Order = require("./Order")(sequelize, DataTypes);
const OrderItem = require("./OrderItem")(sequelize, DataTypes);
const Discard = require("./Discard")(sequelize, DataTypes);
const Review = require("./Review")(sequelize, DataTypes);
const Delivery = require("./Delivery")(sequelize, DataTypes);
const FlowerType = require("./FlowerType")(sequelize, DataTypes);
const Inventory = require("./Inventory")(sequelize, DataTypes);
const ColdroomReservation = require("./ColdroomReservation")(
  sequelize,
  DataTypes
);
const Store = require("./Store")(sequelize, DataTypes);
const HarvestBatch = require("./HarvestBatch")(sequelize, DataTypes);

// =========================
// 🔗 Define Associations
// =========================
User.belongsToMany(Role, { through: UserRole, foreignKey: "user_id" });
Role.belongsToMany(User, { through: UserRole, foreignKey: "role_id" });

UserRole.belongsTo(User, { foreignKey: "user_id" });
UserRole.belongsTo(Role, { foreignKey: "role_id" });

Order.belongsTo(User, { foreignKey: "user_id" });
Review.belongsTo(User, { foreignKey: "user_id" });

Inventory.belongsTo(HarvestBatch, { foreignKey: "harvestBatch_id" });
HarvestBatch.belongsTo(Flower, { foreignKey: "flower_id" });

Delivery.belongsTo(Order, { foreignKey: "order_id" });
Store.belongsTo(User, { foreignKey: "user_id" });

// =========================
// ✅ Export everything
// =========================
module.exports = {
  sequelize,
  User,
  Role,
  UserRole,
  Flower,
  Order,
  OrderItem,
  Discard,
  Review,
  Delivery,
  FlowerType,
  Inventory,
  ColdroomReservation,
  Store,
  HarvestBatch,
};
