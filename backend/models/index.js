// ========================================
// 🌸 EverBloom — Sequelize Model Index
// ========================================
const { Sequelize, DataTypes } = require("sequelize");
const fs = require("fs");
const path = require("path");

// ----------------------------
// DB connection
// ----------------------------
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || "mysql",
    logging: false,
    // Optional: uncomment if your host requires SSL (Render/AlwaysData sometimes do)
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
Flower.belongsTo(FlowerType, { foreignKey: "type_id" });
FlowerType.hasMany(Flower, { foreignKey: "type_id" });

// ✅ HarvestBatch ↔ Flower (M:1)
HarvestBatch.belongsTo(Flower, { foreignKey: "flower_id" });
Flower.hasMany(HarvestBatch, { foreignKey: "flower_id" });

// ✅ Inventory ↔ HarvestBatch (1:1)
Inventory.belongsTo(HarvestBatch, { foreignKey: "harvestBatch_id" });
HarvestBatch.hasOne(Inventory, { foreignKey: "harvestBatch_id" });

// ✅ Order ↔ OrderItem (1:M)
Order.hasMany(OrderItem, { foreignKey: "order_id" });
OrderItem.belongsTo(Order, { foreignKey: "order_id" });

// ✅ OrderItem ↔ Flower (M:1)
OrderItem.belongsTo(Flower, { foreignKey: "flower_id" });
Flower.hasMany(OrderItem, { foreignKey: "flower_id" });

// ✅ ColdroomReservation ↔ HarvestBatch + OrderItem (M:1 each)
ColdroomReservation.belongsTo(HarvestBatch, { foreignKey: "harvestBatch_id" });
ColdroomReservation.belongsTo(OrderItem, { foreignKey: "orderItem_id" });

// Optional: enable reverse relation for easier includes
OrderItem.hasMany(ColdroomReservation, { foreignKey: "orderItem_id" });
HarvestBatch.hasMany(ColdroomReservation, { foreignKey: "harvestBatch_id" });

// ✅ Discard ↔ HarvestBatch + User (M:1 each)
Discard.belongsTo(HarvestBatch, { foreignKey: "harvestBatch_id" });
Discard.belongsTo(User, { as: "discardedBy", foreignKey: "discardedBy_id" });
HarvestBatch.hasMany(Discard, { foreignKey: "harvestBatch_id" });

// ✅ Review ↔ User + Store (M:1 each)
Review.belongsTo(User, { foreignKey: "user_id" });
Review.belongsTo(Store, { foreignKey: "store_id" });
User.hasMany(Review, { foreignKey: "user_id" });
Store.hasMany(Review, { foreignKey: "store_id" });

// ----------------------------
// Export
// ----------------------------
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
