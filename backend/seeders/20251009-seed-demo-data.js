// 🌸 EverBloom — Full Demo Data Seeder
require("dotenv").config();
const {
  sequelize,
  Role,
  User,
  UserRole,
  Store,
  FlowerType,
  Flower,
  HarvestBatch,
  Inventory,
  Order,
  OrderItem,
  Review,
} = require("../models");

const now = () => new Date();

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully\n");

    // =====================================================
    // 👥 USERS & ROLES
    // =====================================================
    const [adminRole] = await Role.findOrCreate({
      where: { roleName: "Admin" },
    });
    const [employeeRole] = await Role.findOrCreate({
      where: { roleName: "Employee" },
    });
    const [customerRole] = await Role.findOrCreate({
      where: { roleName: "Customer" },
    });

    const [admin] = await User.findOrCreate({
      where: { email: "admin@everbloom.local" },
      defaults: {
        fullName: "Admin User",
        passwordHash: "Passw0rd!",
        isActive: true,
        createdAt: now(),
        updatedAt: now(),
      },
    });

    const [employee] = await User.findOrCreate({
      where: { email: "emma@everbloom.local" },
      defaults: {
        fullName: "Emma Employee",
        passwordHash: "test1234",
        isActive: true,
        createdAt: now(),
        updatedAt: now(),
      },
    });

    const [customer1] = await User.findOrCreate({
      where: { email: "jess@everbloom.local" },
      defaults: {
        fullName: "Jess Bloom",
        passwordHash: "test1234",
        phone: "0825557777",
        isActive: true,
        createdAt: now(),
        updatedAt: now(),
      },
    });

    const [customer2] = await User.findOrCreate({
      where: { email: "luca@everbloom.local" },
      defaults: {
        fullName: "Luca Petal",
        passwordHash: "petal123",
        phone: "0831234567",
        isActive: true,
        createdAt: now(),
        updatedAt: now(),
      },
    });

    await UserRole.findOrCreate({
      where: { user_id: admin.user_id, role_id: adminRole.role_id },
    });
    await UserRole.findOrCreate({
      where: { user_id: employee.user_id, role_id: employeeRole.role_id },
    });
    await UserRole.findOrCreate({
      where: { user_id: customer1.user_id, role_id: customerRole.role_id },
    });
    await UserRole.findOrCreate({
      where: { user_id: customer2.user_id, role_id: customerRole.role_id },
    });

    console.log("👥 Users & Roles seeded\n");

    // =====================================================
    // 🏬 STORES
    // =====================================================
    const [store1] = await Store.findOrCreate({
      where: { store_name: "EverBloom HQ" },
      defaults: {
        storeLocation: "Pretoria East",
        address: "123 Flower Rd",
        isOnline: true,
        contact: "0123456789",
        createdAt: now(),
        updatedAt: now(),
      },
    });
    const [store2] = await Store.findOrCreate({
      where: { store_name: "EverBloom Market" },
      defaults: {
        storeLocation: "Johannesburg",
        address: "22 Flower Street",
        isOnline: true,
        contact: "0219876543",
        createdAt: now(),
        updatedAt: now(),
      },
    });
    const [store3] = await Store.findOrCreate({
      where: { store_name: "Cape Bloom Co" },
      defaults: {
        storeLocation: "Cape Town",
        address: "10 Rose Avenue",
        isOnline: true,
        contact: "0211112222",
        createdAt: now(),
        updatedAt: now(),
      },
    });

    console.log("🏬 Stores added\n");

    // =====================================================
    // 🌼 FLOWER TYPES & FLOWERS
    // =====================================================
    const [roseType] = await FlowerType.findOrCreate({
      where: { type_name: "Rose" },
      defaults: { default_shelf_life: 7, createdAt: now(), updatedAt: now() },
    });
    const [lilyType] = await FlowerType.findOrCreate({
      where: { type_name: "Lily" },
      defaults: { default_shelf_life: 5, createdAt: now(), updatedAt: now() },
    });
    const [tulipType] = await FlowerType.findOrCreate({
      where: { type_name: "Tulip" },
      defaults: { default_shelf_life: 6, createdAt: now(), updatedAt: now() },
    });

    const flowers = [
      { type: roseType, variety: "Red Naomi", color: "Red", stem: 50, life: 7 },
      {
        type: roseType,
        variety: "Avalanche",
        color: "White",
        stem: 48,
        life: 7,
      },
      {
        type: lilyType,
        variety: "Stargazer",
        color: "Pink",
        stem: 45,
        life: 5,
      },
      {
        type: tulipType,
        variety: "Yellow Triumph",
        color: "Yellow",
        stem: 35,
        life: 6,
      },
      {
        type: tulipType,
        variety: "Purple Dream",
        color: "Purple",
        stem: 38,
        life: 6,
      },
    ];

    const flowerModels = [];
    for (const f of flowers) {
      const [model] = await Flower.findOrCreate({
        where: { variety: f.variety },
        defaults: {
          type_id: f.type.type_id,
          color: f.color,
          stem_length: f.stem,
          shelf_life: f.life,
          unit: "stem",
          createdAt: now(),
          updatedAt: now(),
        },
      });
      flowerModels.push(model);
    }
    console.log("🌸 Flowers added\n");

    // =====================================================
    // 🌾 HARVEST & INVENTORY
    // =====================================================
    for (const fl of flowerModels) {
      const stems = Math.floor(Math.random() * 100) + 60;
      const [batch] = await HarvestBatch.findOrCreate({
        where: { flower_id: fl.flower_id },
        defaults: {
          harvestDateTime: now(),
          totalStemsHarvested: stems,
          status: "InColdroom",
          createdAt: now(),
          updatedAt: now(),
        },
      });

      await Inventory.findOrCreate({
        where: { harvestBatch_id: batch.harvestBatch_id },
        defaults: {
          stemsInColdroom: stems,
          createdAt: now(),
          updatedAt: now(),
        },
      });
    }
    console.log("🧺 Harvest batches & inventories ready\n");

    // =====================================================
    // 🛒 ORDERS & ITEMS
    // =====================================================
    const [order1] = await Order.findOrCreate({
      where: { user_id: customer1.user_id },
      defaults: {
        status: "Delivered",
        orderDateTime: now(),
        totalAmount: 1250.0,
        pickupOrDelivery: "Delivery",
        pickupStoreID: store1.store_id,
        shippingAddress: "22 Flower Street, Johannesburg",
        createdAt: now(),
        updatedAt: now(),
      },
    });
    const [order2] = await Order.findOrCreate({
      where: { user_id: customer2.user_id },
      defaults: {
        status: "Delivered",
        orderDateTime: now(),
        totalAmount: 860.0,
        pickupOrDelivery: "Pickup",
        pickupStoreID: store2.store_id,
        shippingAddress: "10 Rose Avenue, Cape Town",
        createdAt: now(),
        updatedAt: now(),
      },
    });

    const orderItems = [
      { order: order1, flower: flowerModels[0], qty: 10, price: 20 },
      { order: order1, flower: flowerModels[2], qty: 8, price: 30 },
      { order: order2, flower: flowerModels[3], qty: 12, price: 25 },
      { order: order2, flower: flowerModels[4], qty: 6, price: 28 },
    ];

    for (const item of orderItems) {
      await OrderItem.findOrCreate({
        where: {
          order_id: item.order.order_id,
          flower_id: item.flower.flower_id,
        },
        defaults: {
          quantityOrdered: item.qty,
          unitPrice: item.price,
          discountApplied: 0,
          reservedQuantity: item.qty,
          createdAt: now(),
          updatedAt: now(),
        },
      });
    }
    console.log("🛍️ Orders & items created\n");

    // =====================================================
    // 💬 REVIEWS
    // =====================================================
    const reviews = [
      {
        order: order1,
        user: customer1,
        rating: 5,
        comment: "Loved my bouquet! Fresh and beautifully arranged 🌸",
      },
      {
        order: order2,
        user: customer2,
        rating: 4,
        comment:
          "Gorgeous colors, a few stems were short-lived but still stunning 💐",
      },
    ];
    for (const r of reviews) {
      await Review.findOrCreate({
        where: { order_id: r.order.order_id },
        defaults: {
          user_id: r.user.user_id,
          rating: r.rating,
          comment: r.comment,
          createdAt: now(),
          updatedAt: now(),
        },
      });
    }

    console.log("💬 Reviews added\n");
    console.log("🌺 Full demo data seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeder failed:", err);
    process.exit(1);
  }
})();
