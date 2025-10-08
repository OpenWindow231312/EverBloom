const express = require("express");
const router = express.Router();
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
  sequelize,
} = require("../models");

// ===============================
// 🌸 DASHBOARD OVERVIEW
// ===============================
router.get("/overview", async (req, res) => {
  try {
    const [userCount, orderCount, flowerCount, storeCount, batchCount] =
      await Promise.all([
        User.count(),
        Order.count(),
        Flower.count(),
        Store.count(),
        HarvestBatch.count(),
      ]);

    res.json({
      users: userCount,
      orders: orderCount,
      flowers: flowerCount,
      stores: storeCount,
      harvestBatches: batchCount,
    });
  } catch (err) {
    console.error("Overview error:", err);
    res.status(500).json({ message: "Server error fetching overview" });
  }
});

// ===============================
// 👥 USERS & ROLES MANAGEMENT
// ===============================

// Get all users with roles
router.get("/users", async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: Role,
          through: { attributes: [] },
          attributes: ["roleName"],
        },
      ],
      order: [["user_id", "ASC"]],
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching users" });
  }
});

// Update user role
router.put("/users/:id/role", async (req, res) => {
  try {
    const { role_id } = req.body;
    const user_id = req.params.id;

    const user = await User.findByPk(user_id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await UserRole.destroy({ where: { user_id } });
    await UserRole.create({ user_id, role_id });

    res.json({ message: "User role updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating user role" });
  }
});

// Toggle user activation
router.put("/users/:id/status", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isActive = !user.isActive;
    await user.save();

    res.json({ message: "User status updated", isActive: user.isActive });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating user status" });
  }
});

// ===============================
// 🛒 ORDERS MANAGEMENT
// ===============================
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: User, attributes: ["fullName", "email"] },
        {
          model: OrderItem,
          include: [{ model: Flower, attributes: ["variety", "color"] }],
        },
      ],
      order: [["orderDateTime", "DESC"]],
    });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching orders" });
  }
});

// Update order status
router.put("/orders/:id/status", async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = req.body.status;
    await order.save();

    res.json({ message: "Order status updated", status: order.status });
  } catch (err) {
    res.status(500).json({ message: "Error updating order" });
  }
});

// ===============================
// 🌸 FLOWERS & TYPES
// ===============================
router.get("/flowers", async (req, res) => {
  try {
    const flowers = await Flower.findAll({
      include: [{ model: FlowerType, attributes: ["type_name"] }],
      order: [["flower_id", "ASC"]],
    });
    res.json(flowers);
  } catch (err) {
    res.status(500).json({ message: "Error fetching flowers" });
  }
});

// Add new flower
router.post("/flowers", async (req, res) => {
  try {
    const flower = await Flower.create(req.body);
    res.json(flower);
  } catch (err) {
    res.status(500).json({ message: "Error creating flower" });
  }
});

// ===============================
// 🏬 STORES
// ===============================
router.get("/stores", async (req, res) => {
  try {
    const stores = await Store.findAll({ order: [["store_id", "ASC"]] });
    res.json(stores);
  } catch (err) {
    res.status(500).json({ message: "Error fetching stores" });
  }
});

// ===============================
// 📦 INVENTORY & HARVEST
// ===============================
router.get("/harvests", async (req, res) => {
  try {
    const harvests = await HarvestBatch.findAll({
      include: [
        { model: Flower, attributes: ["variety", "color"] },
        { model: Inventory },
      ],
      order: [["harvestBatch_id", "DESC"]],
    });
    res.json(harvests);
  } catch (err) {
    res.status(500).json({ message: "Error fetching harvests" });
  }
});

// ===============================
// ❄️ COLDROOM RESERVATIONS
// ===============================
router.get("/reservations", async (req, res) => {
  try {
    const reservations = await ColdroomReservation.findAll({
      include: [
        { model: OrderItem, include: [{ model: Flower }] },
        { model: HarvestBatch },
      ],
      order: [["reservation_id", "DESC"]],
    });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: "Error fetching reservations" });
  }
});

// ===============================
// 🗑️ DISCARDS
// ===============================
router.get("/discards", async (req, res) => {
  try {
    const discards = await Discard.findAll({
      include: [
        { model: HarvestBatch, include: [{ model: Flower }] },
        { association: "discardedBy", attributes: ["fullName"] },
      ],
      order: [["discard_id", "DESC"]],
    });
    res.json(discards);
  } catch (err) {
    res.status(500).json({ message: "Error fetching discards" });
  }
});

module.exports = router;
