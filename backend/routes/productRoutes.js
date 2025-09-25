const router = require("express").Router();
const pc = require("../controllers/productController");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");

// Flower catalogue
router.post(
  "/types",
  requireAuth,
  requireRole("Admin", "Employee"),
  pc.createFlowerType
);
router.post(
  "/flowers",
  requireAuth,
  requireRole("Admin", "Employee"),
  pc.createFlower
);
router.get("/flowers", pc.listFlowers);

// Harvest & inventory
router.post(
  "/harvests",
  requireAuth,
  requireRole("Admin", "Employee"),
  pc.createHarvestBatch
);
router.get(
  "/inventory",
  requireAuth,
  requireRole("Admin", "Employee", "Florist"),
  pc.getInventory
);
router.patch(
  "/inventory/:harvestBatch_id",
  requireAuth,
  requireRole("Admin"),
  pc.adjustInventory
);

module.exports = router;
