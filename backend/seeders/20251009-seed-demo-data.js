// 🌸 EverBloom — Demo Data Seeder (Dashboard Example Data)
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

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully\n");

    // 🧍 Create a test customer user
    const [user] = await User.findOrCreate({
      where: { email: "jess@everbloom.local" },
      defaults: {
        fullName: "Jess Bloom",
        passwordHash: "test1234",
        phone: "0825557777",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // 🏬 Create a test store
    const [store] = await Store.findOrCreate({
      where: { store_name: "EverBloom Market" },
      defaults: {
        storeLocation: "Johannesburg",
        address: "22 Flower Street",
        isOnline: true,
        contact: "0219876543",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // 🌼 Create flower types
    const [roseType] = await FlowerType.findOrCreate({
      where: { type_name: "Rose" },
      defaults: {
        default_shelf_life: 7,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      transaction: null,
    });

    const [lilyType] = await FlowerType.findOrCreate({
      where: { type_name: "Lily" },
      defaults: {
        default_shelf_life: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      transaction: null,
    });

    const [tulipType] = await FlowerType.findOrCreate({
      where: { type_name: "Tulip" },
      defaults: {
        default_shelf_life: 6,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      transaction: null,
    });

    console.log("🌿 Flower types ready");

    // 🌷 Add example flowers
    const [flower1] = await Flower.findOrCreate({
      where: { variety: "Red Naomi" },
      defaults: {
        type_id: roseType.type_id,
        color: "Red",
        stem_length: 50,
        shelf_life: 7,
        unit: "stem",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const [flower2] = await Flower.findOrCreate({
      where: { variety: "Stargazer" },
      defaults: {
        type_id: lilyType.type_id,
        color: "Pink",
        stem_length: 45,
        shelf_life: 5,
        unit: "stem",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const [flower3] = await Flower.findOrCreate({
      where: { variety: "Yellow Triumph" },
      defaults: {
        type_id: tulipType.type_id,
        color: "Yellow",
        stem_length: 35,
        shelf_life: 6,
        unit: "stem",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    console.log("💐 Flowers added");

    // 🌾 Add harvest batches and inventories
    const batches = [
      { flower_id: flower1.flower_id, totalStemsHarvested: 120 },
      { flower_id: flower2.flower_id, totalStemsHarvested: 80 },
      { flower_id: flower3.flower_id, totalStemsHarvested: 150 },
    ];

    for (const data of batches) {
      const [batch] = await HarvestBatch.findOrCreate({
        where: { flower_id: data.flower_id },
        defaults: {
          harvestDateTime: new Date(),
          totalStemsHarvested: data.totalStemsHarvested,
          status: "InColdroom",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      await Inventory.findOrCreate({
        where: { harvestBatch_id: batch.harvestBatch_id },
        defaults: {
          stemsInColdroom: data.totalStemsHarvested,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    console.log("🧺 Harvest batches + inventories added");

    // 🛒 Add a test order
    const [order] = await Order.findOrCreate({
      where: { user_id: user.user_id },
      defaults: {
        status: "Delivered",
        orderDateTime: new Date(),
        totalAmount: 1250.0,
        pickupOrDelivery: "Delivery",
        pickupStoreID: store.store_id,
        shippingAddress: "22 Flower Street, Johannesburg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // 🛍️ Add items to the order
    const orderItems = [
      { flower_id: flower1.flower_id, quantityOrdered: 10, unitPrice: 20 },
      { flower_id: flower2.flower_id, quantityOrdered: 8, unitPrice: 30 },
      { flower_id: flower3.flower_id, quantityOrdered: 12, unitPrice: 25 },
    ];

    for (const item of orderItems) {
      await OrderItem.findOrCreate({
        where: { order_id: order.order_id, flower_id: item.flower_id },
        defaults: {
          quantityOrdered: item.quantityOrdered,
          unitPrice: item.unitPrice,
          discountApplied: 0,
          reservedQuantity: item.quantityOrdered,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    console.log("🛒 Order + order items added");

    // 💬 Add a review
    await Review.findOrCreate({
      where: { order_id: order.order_id },
      defaults: {
        user_id: user.user_id,
        rating: 5,
        comment: "Loved my bouquet! Fresh and beautifully arranged 🌸",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    console.log("\n🌺 Demo data seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeder failed:", err);
    process.exit(1);
  }
})();
