const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");

// ===============================
// 📊 Dashboard Analytics Routes
// ===============================

// 🔸 Sales summary (Admin or Employee)
router.get(
  "/sales",
  requireAuth,
  requireRole(["Admin", "Employee"]),
  dashboardController.getSalesSummary
);

// 🔸 Low stock alerts
router.get(
  "/alerts",
  requireAuth,
  requireRole(["Admin", "Employee", "Florist"]),
  dashboardController.getLowStockAlerts
);

// 🔸 Recent activity logs
router.get(
  "/logs",
  requireAuth,
  requireRole(["Admin", "Employee"]),
  dashboardController.getActivityLogs
);

// 🔸 Inventory overview
router.get(
  "/inventory",
  requireAuth,
  requireRole(["Admin", "Employee", "Florist"]),
  dashboardController.getInventoryOverview
);

// ===============================
// ✅ Export Router
// ===============================
module.exports = router;
