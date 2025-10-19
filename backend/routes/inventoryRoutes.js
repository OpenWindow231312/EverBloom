const express = require("express");
const router = express.Router();
const { getAllInventory } = require("../controllers/inventoryController");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");

router.get("/", requireAuth, requireRole("Admin", "Employee"), getAllInventory);

module.exports = router;
