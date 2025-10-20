// ========================================
// 🌸 EverBloom — Shop Routes (Fixed)
// ========================================
const express = require("express");
const router = express.Router();
const db = require("../models"); // Import full db object

const { Flower, FlowerType } = db;

// 🛍️ Get all flowers listed for sale
router.get("/", async (req, res) => {
  try {
    const flowers = await Flower.findAll({
      include: [
        {
          model: FlowerType,
          attributes: [["type_name", "flowerTypeName"]], // ✅ alias for clean JSON
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

module.exports = router;
