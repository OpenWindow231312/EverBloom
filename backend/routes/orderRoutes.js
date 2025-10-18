// ========================================
// 🌸 EverBloom — Order Routes
// ========================================
const express = require("express");
const router = express.Router();

// ✅ Import controllers and middleware
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

module.exports = router;
