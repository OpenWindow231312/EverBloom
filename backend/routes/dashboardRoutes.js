// ========================================
// 🌸 EverBloom — Dashboard Routes (FIXED)
// ========================================
const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");

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
} = require("../models");

const { requireAuth, requireRole } = require("../middleware/authMiddleware");

// ===============================
// 🌸 DASHBOARD OVERVIEW
// ===============================
router.get(
  "/overview",
  requireAuth,
  requireRole("Admin", "Employee"),
  async (req, res) => {
    try {
      const [
        userCount,
        activeUsers,
        orderCount,
        pendingOrders,
        completedOrders,
        flowerCount,
        storeCount,
        batchCount,
        reviewCount,
        totalColdroomStems,
        lowStockCount,
      ] = await Promise.all([
        User.count(),
        User.count({ where: { isActive: true } }),
        Order.count(),
        Order.count({ where: { status: "Pending" } }),
        Order.count({ where: { status: "Delivered" } }),
        Flower.count(),
        Store.count(),
        HarvestBatch.count(),
        Review.count().catch(() => 0),
        Inventory.sum("stemsInColdroom").then((v) => v || 0),
        Inventory.count({ where: { stemsInColdroom: { [Op.lt]: 50 } } }),
      ]);

      res.json({
        users: userCount,
        activeUsers,
        orders: orderCount,
        pendingOrders,
        completedOrders,
        flowers: flowerCount,
        stores: storeCount,
        harvestBatches: batchCount,
        reviews: reviewCount || 0,
        flowersInColdroom: totalColdroomStems || 0,
        lowStock: lowStockCount || 0,
      });
    } catch (err) {
      console.error("❌ Dashboard overview error:", err);
      res.status(500).json({
        message: "Server error fetching overview",
        error: err.message,
      });
    }
  }
);

// ===============================
// 👥 USERS & ROLES MANAGEMENT
// ===============================
router.get("/users", requireAuth, requireRole("Admin"), async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: Role,
          through: { attributes: [] },
          attributes: ["role_id", "roleName"],
        },
      ],
      order: [["user_id", "ASC"]],
    });

    // ✅ Flatten structure for frontend
    const formatted = users.map((u) => ({
      user_id: u.user_id,
      fullName: u.fullName,
      email: u.email,
      phone: u.phone,
      isActive: u.isActive,
      role_id: u.Roles?.[0]?.role_id || null,
      roleName: u.Roles?.[0]?.roleName || "Customer",
    }));

    res.json(formatted);
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    res.status(500).json({ message: "Error fetching users" });
  }
});

router.put(
  "/users/:id/role",
  requireAuth,
  requireRole("Admin"),
  async (req, res) => {
    try {
      const { role_id } = req.body;
      const user_id = req.params.id;
      const user = await User.findByPk(user_id);
      if (!user) return res.status(404).json({ message: "User not found" });

      await UserRole.destroy({ where: { user_id } });
      await UserRole.create({ user_id, role_id });

      res.json({ message: "✅ User role updated successfully" });
    } catch (err) {
      console.error("❌ Error updating user role:", err);
      res.status(500).json({ message: "Error updating user role" });
    }
  }
);

router.put(
  "/users/:id/status",
  requireAuth,
  requireRole("Admin"),
  async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      user.isActive = !user.isActive;
      await user.save();
      res.json({ message: "✅ User status updated", isActive: user.isActive });
    } catch (err) {
      console.error("❌ Error updating user status:", err);
      res.status(500).json({ message: "Error updating user status" });
    }
  }
);

router.delete(
  "/users/:id",
  requireAuth,
  requireRole("Admin"),
  async (req, res) => {
    try {
      const { id } = req.params;
      await UserRole.destroy({ where: { user_id: id } });
      const deleted = await User.destroy({ where: { user_id: id } });
      if (!deleted)
        return res
          .status(404)
          .json({ message: "User not found or already deleted" });

      res.json({ message: "✅ User deleted successfully" });
    } catch (err) {
      console.error("❌ Error deleting user:", err);
      res.status(500).json({ message: "Error deleting user" });
    }
  }
);

// ===============================
// 📜 GET ALL ROLES
// ===============================
router.get("/roles", requireAuth, requireRole("Admin"), async (req, res) => {
  try {
    const roles = await Role.findAll({
      attributes: ["role_id", "roleName"],
      order: [["roleName", "ASC"]],
    });
    res.json(roles);
  } catch (err) {
    console.error("❌ Error fetching roles:", err);
    res.status(500).json({ message: "Error fetching roles" });
  }
});

// ===============================
// 🛒 ORDERS MANAGEMENT
// ===============================
router.get(
  "/orders",
  requireAuth,
  requireRole("Admin", "Employee"),
  async (req, res) => {
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
      console.error("❌ Error fetching orders:", err);
      res.status(500).json({ message: "Error fetching orders" });
    }
  }
);

router.put(
  "/orders/:id/status",
  requireAuth,
  requireRole("Admin", "Employee"),
  async (req, res) => {
    try {
      const order = await Order.findByPk(req.params.id);
      if (!order) return res.status(404).json({ message: "Order not found" });

      order.status = req.body.status;
      await order.save();

      res.json({ message: "✅ Order status updated", status: order.status });
    } catch (err) {
      console.error("❌ Error updating order:", err);
      res.status(500).json({ message: "Error updating order" });
    }
  }
);

// ===============================
// 🌸 FLOWERS & TYPES (Cleaned)
// ===============================
router.get(
  "/flowers",
  requireAuth,
  requireRole("Admin", "Employee"),
  async (req, res) => {
    try {
      const flowers = await Flower.findAll({
        include: [
          {
            model: FlowerType,
            attributes: ["type_id", "type_name", "default_shelf_life"],
          },
          {
            model: HarvestBatch,
            attributes: [
              "harvestBatch_id",
              "status",
              "totalStemsHarvested",
              "harvestDateTime",
            ],
            include: [{ model: Inventory, attributes: ["stemsInColdroom"] }],
          },
        ],
        order: [["flower_id", "ASC"]],
      });

      const validFlowers = flowers.filter((f) => {
        const recentBatch = f.HarvestBatches?.[0];
        if (!recentBatch) return true;
        const isExpired = recentBatch.status === "Discarded";
        const isEmpty = recentBatch.Inventory?.stemsInColdroom <= 0;
        return !isExpired && !isEmpty;
      });

      res.json(validFlowers);
    } catch (err) {
      console.error("❌ Error fetching flowers:", err);
      res
        .status(500)
        .json({ message: "Error fetching flowers", error: err.message });
    }
  }
);

router.get(
  "/flower-types",
  requireAuth,
  requireRole("Admin", "Employee"),
  async (req, res) => {
    try {
      const flowerTypes = await FlowerType.findAll({
        attributes: ["type_id", "type_name", "default_shelf_life"],
        order: [["type_name", "ASC"]],
      });
      res.json(flowerTypes);
    } catch (err) {
      console.error("❌ Error fetching flower types:", err);
      res
        .status(500)
        .json({ message: "Error fetching flower types", error: err.message });
    }
  }
);

router.post(
  "/flowers",
  requireAuth,
  requireRole("Admin", "Employee"),
  async (req, res) => {
    try {
      const flower = await Flower.create(req.body);
      res.json({ message: "✅ Flower created successfully", flower });
    } catch (err) {
      console.error("❌ Error creating flower:", err);
      res
        .status(500)
        .json({ message: "Error creating flower", error: err.message });
    }
  }
);

router.put(
  "/flowers/:id",
  requireAuth,
  requireRole("Admin", "Employee"),
  async (req, res) => {
    try {
      const flower = await Flower.findByPk(req.params.id);
      if (!flower) return res.status(404).json({ message: "Flower not found" });

      await flower.update(req.body);
      res.json({ message: "✅ Flower updated successfully", flower });
    } catch (err) {
      console.error("❌ Error updating flower:", err);
      res
        .status(500)
        .json({ message: "Error updating flower", error: err.message });
    }
  }
);

router.delete(
  "/flowers/:id",
  requireAuth,
  requireRole("Admin", "Employee"),
  async (req, res) => {
    try {
      const deleted = await Flower.destroy({
        where: { flower_id: req.params.id },
      });
      if (!deleted)
        return res.status(404).json({ message: "Flower not found" });
      res.json({ message: "✅ Flower deleted successfully" });
    } catch (err) {
      console.error("❌ Error deleting flower:", err);
      res
        .status(500)
        .json({ message: "Error deleting flower", error: err.message });
    }
  }
);

// ===============================
// 🏬 STORES
// ===============================
router.get(
  "/stores",
  requireAuth,
  requireRole("Admin", "Employee"),
  async (req, res) => {
    try {
      const stores = await Store.findAll({ order: [["store_id", "ASC"]] });
      res.json(stores);
    } catch (err) {
      console.error("❌ Error fetching stores:", err);
      res.status(500).json({ message: "Error fetching stores" });
    }
  }
);

// ===============================
// 📦 HARVESTS / INVENTORY
// ===============================
router.get(
  "/harvests",
  requireAuth,
  requireRole("Admin", "Employee"),
  async (req, res) => {
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
      console.error("❌ Error fetching harvests:", err);
      res.status(500).json({ message: "Error fetching harvests" });
    }
  }
);

// ===============================
// ❄️ COLDROOM RESERVATIONS
// ===============================
router.get(
  "/reservations",
  requireAuth,
  requireRole("Admin", "Employee"),
  async (req, res) => {
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
      console.error("❌ Error fetching reservations:", err);
      res.status(500).json({ message: "Error fetching reservations" });
    }
  }
);

// ===============================
// 🗑️ DISCARDS
// ===============================
router.get(
  "/discards",
  requireAuth,
  requireRole("Admin", "Employee"),
  async (req, res) => {
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
      console.error("❌ Error fetching discards:", err);
      res.status(500).json({ message: "Error fetching discards" });
    }
  }
);

// ===============================
// 🌾 UPDATE HARVEST BATCH
// ===============================
router.put(
  "/harvests/:id",
  requireAuth,
  requireRole("Admin", "Employee"),
  async (req, res) => {
    try {
      const harvest = await HarvestBatch.findByPk(req.params.id);
      if (!harvest)
        return res.status(404).json({ message: "Harvest not found" });

      const { totalStemsHarvested, harvestDateTime, notes, status } = req.body;
      harvest.totalStemsHarvested =
        totalStemsHarvested ?? harvest.totalStemsHarvested;
      harvest.harvestDateTime = harvestDateTime ?? harvest.harvestDateTime;
      harvest.notes = notes ?? harvest.notes;
      harvest.status = status ?? harvest.status;

      await harvest.save();
      res.json({ message: "✅ Harvest batch updated successfully", harvest });
    } catch (err) {
      console.error("❌ Error updating harvest:", err);
      res.status(500).json({ message: "Error updating harvest batch" });
    }
  }
);

module.exports = router;
