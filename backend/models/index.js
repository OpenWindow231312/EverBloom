// ========================================
// 🌸 EverBloom — Sequelize Model Index
// ========================================
const { Sequelize, DataTypes } = require("sequelize");
const fs = require("fs");
const path = require("path");

// ----------------------------
// DB Connection
// ----------------------------
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || "mysql",
    logging: false,
    // Optional: uncomment if Render/AlwaysData require SSL
    // dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
  }
);

// ----------------------------
// Load all model files dynamically
// ----------------------------
const db = {};
const basename = path.basename(__filename);

fs.readdirSync(__dirname)
  .filter((file) => file !== basename && file.endsWith(".js"))
  .forEach((file) => {
    const modelFactory = require(path.join(__dirname, file));
    const model = modelFactory(sequelize, DataTypes);
    db[model.name] = model;
  });

// ----------------------------
// Destructure loaded models
// ----------------------------
const {
  User,
  Role,
  UserRole,
  Order,
  OrderItem,
  Flower,
  FlowerType,
  HarvestBatch,
  Inventory,
  Store,
  ColdroomReservation,
  Discard,
  Review,
} = db;

// ----------------------------
// Associations
// ----------------------------

// ✅ Users ↔ Roles (Many-to-Many)
User.belongsToMany(Role, {
  through: UserRole,
  foreignKey: "user_id",
  otherKey: "role_id",
});
Role.belongsToMany(User, {
  through: UserRole,
  foreignKey: "role_id",
  otherKey: "user_id",
});
UserRole.belongsTo(User, { foreignKey: "user_id" });
UserRole.belongsTo(Role, { foreignKey: "role_id" });
User.hasMany(UserRole, { foreignKey: "user_id" });
Role.hasMany(UserRole, { foreignKey: "role_id" });

// ✅ User ↔ Order (1:M)
User.hasMany(Order, { foreignKey: "user_id" });
Order.belongsTo(User, { foreignKey: "user_id" });

// ✅ Flower ↔ FlowerType (M:1)
Flower.belongsTo(FlowerType, { as: "FlowerType", foreignKey: "type_id" });
FlowerType.hasMany(Flower, { as: "Flowers", foreignKey: "type_id" });

// ✅ HarvestBatch ↔ Flower (M:1)
HarvestBatch.belongsTo(Flower, { as: "Flower", foreignKey: "flower_id" });
Flower.hasMany(HarvestBatch, { as: "HarvestBatches", foreignKey: "flower_id" });

// ✅ Inventory ↔ HarvestBatch (1:1)
Inventory.belongsTo(HarvestBatch, {
  as: "HarvestBatch",
  foreignKey: "harvestBatch_id",
});
HarvestBatch.hasOne(Inventory, {
  as: "Inventory",
  foreignKey: "harvestBatch_id",
});

// ✅ Order ↔ OrderItem (1:M)
Order.hasMany(OrderItem, { as: "OrderItems", foreignKey: "order_id" });
OrderItem.belongsTo(Order, { as: "Order", foreignKey: "order_id" });

// ✅ OrderItem ↔ Flower (M:1)
OrderItem.belongsTo(Flower, { as: "Flower", foreignKey: "flower_id" });
Flower.hasMany(OrderItem, { as: "OrderItems", foreignKey: "flower_id" });

// ✅ ColdroomReservation ↔ HarvestBatch + OrderItem (M:1 each)
ColdroomReservation.belongsTo(HarvestBatch, {
  as: "HarvestBatch",
  foreignKey: "harvestBatch_id",
});
ColdroomReservation.belongsTo(OrderItem, {
  as: "OrderItem",
  foreignKey: "orderItem_id",
});
OrderItem.hasMany(ColdroomReservation, {
  as: "ColdroomReservations",
  foreignKey: "orderItem_id",
});
HarvestBatch.hasMany(ColdroomReservation, {
  as: "ColdroomReservations",
  foreignKey: "harvestBatch_id",
});

// ✅ Discard ↔ HarvestBatch + User (M:1 each)
Discard.belongsTo(HarvestBatch, {
  as: "HarvestBatch",
  foreignKey: "harvestBatch_id",
});
Discard.belongsTo(User, {
  as: "DiscardedBy",
  foreignKey: "discardedByEmployeeID",
});
HarvestBatch.hasMany(Discard, {
  as: "Discards",
  foreignKey: "harvestBatch_id",
});

// ✅ Review ↔ User + Store (M:1 each)
Review.belongsTo(User, { as: "User", foreignKey: "user_id" });
Review.belongsTo(Store, { as: "Store", foreignKey: "store_id" });
User.hasMany(Review, { as: "Reviews", foreignKey: "user_id" });
Store.hasMany(Review, { as: "Reviews", foreignKey: "store_id" });

// ----------------------------
// Export
// ----------------------------
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
