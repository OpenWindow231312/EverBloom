// ========================================
// 🌸 EverBloom — Shop Routes (Enhanced with Search + Single Product)
// ========================================
const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const db = require("../models"); // Import full db object

const { Flower, FlowerType } = db;

// 🛍️ Get all flowers listed for sale
router.get("/", async (req, res) => {
  try {
    const flowers = await Flower.findAll({
      include: [
        {
          model: FlowerType,
          attributes: [["type_name", "flowerTypeName"]], // ✅ clean alias
        },
      ],
      where: { is_listed_for_sale: 1 },
      order: [["flower_id", "ASC"]],
    });

    res.json(flowers);
  } catch (error) {
    console.error("❌ Error fetching flowers:", error.message);
    res.status(500).json({ message: "Server error", details: error.message });
  }
});

// 🔍 Search flowers by variety or type
router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || query.trim() === "") {
      return res.status(400).json({ message: "Missing search query" });
    }

    const flowers = await Flower.findAll({
      include: [
        {
          model: FlowerType,
          attributes: [["type_name", "flowerTypeName"]],
          where: {
            type_name: { [Op.like]: `%${query}%` },
          },
          required: false, // ✅ optional join
        },
      ],
      where: {
        [Op.or]: [
          { variety: { [Op.like]: `%${query}%` } },
          { color: { [Op.like]: `%${query}%` } }, // if color field exists
        ],
        is_listed_for_sale: 1,
      },
      limit: 12,
      order: [["variety", "ASC"]],
    });

    res.json(flowers);
  } catch (error) {
    console.error("❌ Error performing search:", error.message);
    res
      .status(500)
      .json({ message: "Error searching flowers", details: error.message });
  }
});

// 🌸 Get single flower by ID
router.get("/:id", async (req, res) => {
  try {
    const flower = await Flower.findByPk(req.params.id, {
      include: [
        {
          model: FlowerType,
          attributes: [["type_name", "flowerTypeName"]],
        },
      ],
    });

    if (!flower) {
      return res.status(404).json({ message: "Flower not found" });
    }

    res.json(flower);
  } catch (error) {
    console.error("❌ Error fetching flower:", error.message);
    res.status(500).json({ message: "Server error", details: error.message });
  }
});

module.exports = router;
