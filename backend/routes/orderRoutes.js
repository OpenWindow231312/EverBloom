// ========================================
// 🌸 EverBloom — Order Routes (Fixed)
// ========================================
const express = require("express");
const router = express.Router();

// ✅ Import full models instance safely
const db = require("../models");
const { Order, OrderItem, User, Flower } = db;

// ✅ Import controllers & middleware
const orderController = require("../controllers/orderController");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");

// ===============================
// 🛒 Create New Order (Customer)
// ===============================
router.post(
  "/",
  requireAuth,
  requireRole("Customer", "Admin", "Employee"),
  async (req, res) => {
    try {
      await orderController.createOrder(req, res);
    } catch (err) {
      console.error("❌ Create order error:", err);
      res
        .status(500)
        .json({ message: "Failed to create order", error: err.message });
    }
  }
);

// ===============================
// 📦 Reserve Order (Admin/Employee)
// ===============================
router.post(
  "/:order_id/reserve",
  requireAuth,
  requireRole("Admin", "Employee"),
  async (req, res) => {
    try {
      await orderController.reserveOrder(req, res);
    } catch (err) {
      console.error("❌ Reserve order error:", err);
      res
        .status(500)
        .json({ message: "Failed to reserve order", error: err.message });
    }
  }
);

// ===============================
// 🚚 Fulfil Order (Admin/Employee)
// ===============================
router.post(
  "/:order_id/fulfil",
  requireAuth,
  requireRole("Admin", "Employee"),
  async (req, res) => {
    try {
      await orderController.fulfilOrder(req, res);
    } catch (err) {
      console.error("❌ Fulfil order error:", err);
      res
        .status(500)
        .json({ message: "Failed to fulfil order", error: err.message });
    }
  }
);

// ===============================
// ❌ Cancel Order (Admin/Employee)
// ===============================
router.post(
  "/:order_id/cancel",
  requireAuth,
  requireRole("Admin", "Employee"),
  async (req, res) => {
    try {
      await orderController.cancelOrder(req, res);
    } catch (err) {
      console.error("❌ Cancel order error:", err);
      res
        .status(500)
        .json({ message: "Failed to cancel order", error: err.message });
    }
  }
);

// ===============================
// 📋 GET All Orders (Admin/Employee Dashboard)
// ===============================
router.get(
  "/",
  requireAuth,
  requireRole("Admin", "Employee"),
  async (_req, res) => {
    try {
      console.log("🧩 Fetching all orders...");

      const orders = await db.Order.findAll({
        include: [
          {
            model: db.User,
            attributes: ["fullName", "email"], // ✅ fixed here
          },
          {
            model: db.OrderItem,
            include: [
              {
                model: db.Flower,
                attributes: ["variety", "color", "price_per_stem"],
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      console.log(`✅ Found ${orders.length} orders`);
      res.json(orders);
    } catch (err) {
      console.error("❌ Error fetching orders:", err);
      res.status(500).json({ message: err.message });
    }
  }
);

// ===============================
// 🔄 Update Order Status (Admin/Employee Dashboard)
// ===============================
router.put(
  "/:id",
  requireAuth,
  requireRole("Admin", "Employee"),
  async (req, res) => {
    try {
      const order = await Order.findByPk(req.params.id);
      if (!order) return res.status(404).json({ message: "Order not found" });

      order.status = req.body.status || order.status;
      await order.save();

      res.json({ message: "✅ Order updated successfully", order });
    } catch (err) {
      console.error("❌ Error updating order:", err);
      res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;
