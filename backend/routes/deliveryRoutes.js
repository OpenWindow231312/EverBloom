// ========================================
// 🌸 EverBloom — Delivery Routes
// ========================================
const express = require("express");
const router = express.Router();

// ✅ Imports
const deliveryController = require("../controllers/deliveryController");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");

// ===============================
// 🚚 Create a Delivery (Admin / Employee)
// ===============================
router.post(
  "/",
  requireAuth,
  requireRole("Admin", "Employee"),
  async (req, res) => {
    try {
      await deliveryController.createDelivery(req, res);
    } catch (err) {
      console.error("❌ Error creating delivery:", err);
      res.status(500).json({
        message: "Failed to create delivery",
        error: err.message,
      });
    }
  }
);

// ===============================
// 📦 Get All Deliveries (Admin / Employee)
// ===============================
router.get(
  "/",
  requireAuth,
  requireRole("Admin", "Employee"),
  async (req, res) => {
    try {
      await deliveryController.getAllDeliveries(req, res);
    } catch (err) {
      console.error("❌ Error fetching deliveries:", err);
      res.status(500).json({
        message: "Failed to fetch deliveries",
        error: err.message,
      });
    }
  }
);

// ===============================
// 🔄 Update Delivery Status (Admin / Employee)
// ===============================
router.put(
  "/:id/status",
  requireAuth,
  requireRole("Admin", "Employee"),
  async (req, res) => {
    try {
      await deliveryController.updateDeliveryStatus(req, res);
    } catch (err) {
      console.error("❌ Error updating delivery status:", err);
      res.status(500).json({
        message: "Failed to update delivery status",
        error: err.message,
      });
    }
  }
);

module.exports = router;
