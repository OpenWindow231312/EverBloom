// ========================================
// 🌸 EverBloom — Flower Routes (Stock Management)
// ========================================
const express = require("express");
const router = express.Router();
const { Flower, FlowerType } = require("../models");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");

// ===============================
// 🌸 FLOWER TYPE MANAGEMENT
// ===============================

// ➕ Create new flower type
router.post(
  "/types",
  requireAuth,
  requireRole("Admin", "Employee"),
  async (req, res) => {
    try {
      const { type_name, default_shelf_life } = req.body;

      if (!type_name)
        return res.status(400).json({ message: "Type name is required" });

      const newType = await FlowerType.create({
        type_name,
        default_shelf_life: default_shelf_life || 7,
      });

      res.json({ message: "✅ Flower type added", newType });
    } catch (err) {
      console.error("❌ Error creating flower type:", err);
      res.status(500).json({ message: err.message });
    }
  }
);

// 📖 Get all flower types
router.get(
  "/types",
  requireAuth,
  requireRole("Admin", "Employee"),
  async (_req, res) => {
    try {
      const types = await FlowerType.findAll({ order: [["type_id", "ASC"]] });
      res.json(types);
    } catch (err) {
      console.error("❌ Error fetching flower types:", err);
      res.status(500).json({ message: err.message });
    }
  }
);

// ===============================
// 🌷 FLOWER MANAGEMENT
// ===============================

// ➕ Create new flower
router.post(
  "/",
  requireAuth,
  requireRole("Admin", "Employee"),
  async (req, res) => {
    try {
      const {
        type_id,
        variety,
        color,
        stem_length,
        shelf_life,
        price_per_stem,
        sale_price_per_stem,
        description,
        image_url,
        is_listed_for_sale,
        is_on_sale,
      } = req.body;

      if (!type_id || !variety)
        return res
          .status(400)
          .json({ message: "Type and variety are required fields" });

      const newFlower = await Flower.create({
        type_id,
        variety,
        color,
        stem_length,
        shelf_life,
        price_per_stem,
        sale_price_per_stem,
        description,
        image_url,
        is_listed_for_sale: !!is_listed_for_sale,
        is_on_sale: !!is_on_sale,
      });

      res.json({ message: "✅ Flower added successfully", newFlower });
    } catch (err) {
      console.error("❌ Error adding flower:", err);
      res.status(500).json({ message: err.message });
    }
  }
);

// 📖 Get all flowers
router.get(
  "/",
  requireAuth,
  requireRole("Admin", "Employee"),
  async (_req, res) => {
    try {
      const flowers = await Flower.findAll({
        include: [{ model: FlowerType, attributes: ["type_name"] }],
        order: [["flower_id", "ASC"]],
      });
      res.json(flowers);
    } catch (err) {
      console.error("❌ Error fetching flowers:", err);
      res.status(500).json({ message: err.message });
    }
  }
);

// ✏️ Update flower
router.put(
  "/:id",
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
      res.status(500).json({ message: err.message });
    }
  }
);

// 🗑 Delete flower
router.delete("/:id", requireAuth, requireRole("Admin"), async (req, res) => {
  try {
    const flower = await Flower.findByPk(req.params.id);
    if (!flower) return res.status(404).json({ message: "Flower not found" });

    await flower.destroy();
    res.json({ message: "✅ Flower deleted" });
  } catch (err) {
    console.error("❌ Error deleting flower:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
