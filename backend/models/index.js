// ========================================
// 🌸 EverBloom — Sequelize Model Index (Render Ready)
// ========================================
const { Sequelize, DataTypes } = require("sequelize");
const fs = require("fs");
const path = require("path");

// ----------------------------
// DB Connection (Render / Cloud SQL compatible)
// ----------------------------
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || "mysql",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000, // wait 30s before timeout
      idle: 10000,
    },
  }
);

// ----------------------------
// Load all models dynamically
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
// Initialize associations
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

// ✅ USERS & ROLES (Many-to-Many)
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

// ✅ USER ↔ ORDER (1:M)
User.hasMany(Order, { foreignKey: "user_id" });
Order.belongsTo(User, { foreignKey: "user_id" });

// ✅ FLOWER ↔ FLOWER TYPE (M:1)
Flower.belongsTo(FlowerType, { foreignKey: "type_id" });
FlowerType.hasMany(Flower, { foreignKey: "type_id" });

// ✅ HARVEST BATCH ↔ FLOWER (M:1)
HarvestBatch.belongsTo(Flower, { foreignKey: "flower_id" });
Flower.hasMany(HarvestBatch, { foreignKey: "flower_id" });

// ✅ INVENTORY ↔ HARVEST BATCH (1:1)
Inventory.belongsTo(HarvestBatch, { foreignKey: "harvestBatch_id" });
HarvestBatch.hasOne(Inventory, { foreignKey: "harvestBatch_id" });

// ✅ ORDER ↔ ORDER ITEM (1:M)
Order.hasMany(OrderItem, { foreignKey: "order_id" });
OrderItem.belongsTo(Order, { foreignKey: "order_id" });

// ✅ ORDER ITEM ↔ FLOWER (M:1)
OrderItem.belongsTo(Flower, { foreignKey: "flower_id" });
Flower.hasMany(OrderItem, { foreignKey: "flower_id" });

// ✅ COLDROOM RESERVATIONS ↔ HARVEST BATCH / ORDER ITEM
ColdroomReservation.belongsTo(HarvestBatch, { foreignKey: "harvestBatch_id" });
ColdroomReservation.belongsTo(OrderItem, { foreignKey: "orderItem_id" });
HarvestBatch.hasMany(ColdroomReservation, { foreignKey: "harvestBatch_id" });
OrderItem.hasMany(ColdroomReservation, { foreignKey: "orderItem_id" });

// ✅ DISCARD ↔ HARVEST BATCH + USER (FIXED)
Discard.belongsTo(HarvestBatch, { foreignKey: "harvestBatch_id" });
Discard.belongsTo(User, {
  as: "discardedBy",
  foreignKey: "discardedByEmployeeID", // ✅ fixed name
});
HarvestBatch.hasMany(Discard, { foreignKey: "harvestBatch_id" });

// ✅ REVIEW ↔ USER + STORE
Review.belongsTo(User, { foreignKey: "user_id" });
Review.belongsTo(Store, { foreignKey: "store_id" });
User.hasMany(Review, { foreignKey: "user_id" });
Store.hasMany(Review, { foreignKey: "store_id" });

// ----------------------------
// Run associate() methods dynamically
// ----------------------------
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// ----------------------------
// Export Sequelize + Models
// ----------------------------
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
