const express = require("express");
const router = express.Router();
const flowerController = require("../controllers/flowerController");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");

// ===============================
// 🌸 Flower Catalogue Management
// ===============================

// ➕ Create a new flower type (Admin or Employee)
router.post(
  "/types",
  requireAuth,
  requireRole(["Admin", "Employee"]),
  flowerController.createFlowerType
);

// ➕ Add a new flower (Admin or Employee)
router.post(
  "/flowers",
  requireAuth,
  requireRole(["Admin", "Employee"]),
  flowerController.createFlower
);

// 📖 Get all flowers (public endpoint)
router.get("/flowers", flowerController.listFlowers);

// ===============================
// 🌾 Harvest & Inventory Management
// ===============================

// 🌻 Record a new harvest batch
router.post(
  "/harvests",
  requireAuth,
  requireRole(["Admin", "Employee"]),
  flowerController.createHarvestBatch
);

// 📦 Get current inventory (Admin, Employee, Florist)
router.get(
  "/inventory",
  requireAuth,
  requireRole(["Admin", "Employee", "Florist"]),
  flowerController.getInventory
);

// 🔧 Adjust inventory for a specific harvest batch
router.patch(
  "/inventory/:harvestBatch_id",
  requireAuth,
  requireRole(["Admin"]),
  flowerController.adjustInventory
);

// ===============================
// ✅ Export Router
// ===============================
module.exports = router;
