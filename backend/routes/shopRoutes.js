// ========================================
// 🌸 EverBloom — Shop Routes (Final Fixed Version)
// ========================================
const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const db = require("../models");

// ----------------------------------------
// Pull models + Sequelize
// ----------------------------------------
const { Flower, FlowerType, HarvestBatch, Inventory, Sequelize } = db;

// ========================================
// 🛍️ Get all flowers listed for sale + include stock and sort sold-out last
// ========================================
router.get("/", async (req, res) => {
  try {
    const today = new Date();

    // 1️⃣ Fetch all listed flowers
    const flowers = await Flower.findAll({
      include: [
        {
          model: FlowerType,
          attributes: [["type_name", "flowerTypeName"]],
        },
      ],
      where: { is_listed_for_sale: 1 },
    });

    // 2️⃣ Aggregate stock per flower (only non-expired, coldroom batches)
    const stockData = await Inventory.findAll({
      include: [
        {
          model: HarvestBatch,
          attributes: ["flower_id", "expiryDate"],
          where: {
            status: "InColdroom",
            [Op.or]: [
              { expiryDate: { [Op.gt]: today } },
              { expiryDate: null }, // ✅ counts batches without expiry
            ],
          },
          required: true,
        },
      ],
      where: {
        archived: 0,
        status: { [Op.ne]: "Expired" },
      },
      attributes: [
        [Sequelize.fn("SUM", Sequelize.col("stemsInColdroom")), "total"],
        [Sequelize.col("HarvestBatch.flower_id"), "flower_id"],
      ],
      group: ["HarvestBatch.flower_id"],
      raw: true,
    });

    // 3️⃣ Map stock counts by flower_id
    const stockMap = {};
    stockData.forEach((s) => {
      stockMap[s.flower_id] = Number(s.total) || 0;
    });

    // 4️⃣ Merge stock + mark sold out, then sort sold-out last
    const enriched = flowers
      .map((f) => {
        const stock_available = stockMap[f.flower_id] || 0;
        const isSoldOut = stock_available <= 0;
        return {
          ...f.toJSON(),
          stock_available,
          isSoldOut,
        };
      })
      .sort((a, b) => {
        // All in-stock items first, sold-out items last
        if (a.isSoldOut && !b.isSoldOut) return 1;
        if (!a.isSoldOut && b.isSoldOut) return -1;
        return a.variety.localeCompare(b.variety);
      });

    // ✅ Debug logs
    console.log("🧮 Stock Map:", stockMap);
    console.log("🌸 Enriched sample:", enriched.slice(0, 3));

    res.json(enriched);
  } catch (error) {
    console.error("❌ Error fetching flowers with stock:", error.message);
    res.status(500).json({ message: "Server error", details: error.message });
  }
});

// ========================================
// 🔍 Search flowers by variety / type / color
// ========================================
router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || query.trim() === "") {
      return res.status(400).json({ message: "Missing search query" });
    }

    const today = new Date();

    // 1️⃣ Search flowers
    const flowers = await Flower.findAll({
      include: [
        {
          model: FlowerType,
          attributes: [["type_name", "flowerTypeName"]],
          where: { type_name: { [Op.like]: `%${query}%` } },
          required: false,
        },
      ],
      where: {
        [Op.or]: [
          { variety: { [Op.like]: `%${query}%` } },
          { color: { [Op.like]: `%${query}%` } },
        ],
        is_listed_for_sale: 1,
      },
      order: [["variety", "ASC"]],
    });

    // 2️⃣ Pull stock for matched flowers
    const stockData = await Inventory.findAll({
      include: [
        {
          model: HarvestBatch,
          attributes: ["flower_id", "expiryDate"],
          where: {
            status: "InColdroom",
            [Op.or]: [
              { expiryDate: { [Op.gt]: today } }, // fresh
              { expiryDate: null }, // ✅ no expiry date — still counts
            ],
          },
          required: true,
        },
      ],
      where: {
        archived: 0,
        status: { [Op.ne]: "Expired" },
      },
      attributes: [
        [Sequelize.fn("SUM", Sequelize.col("stemsInColdroom")), "total"],
        [Sequelize.col("HarvestBatch.flower_id"), "flower_id"],
      ],
      group: ["HarvestBatch.flower_id"],
      raw: true,
    });

    // 3️⃣ Merge and sort
    const stockMap = {};
    stockData.forEach((s) => {
      stockMap[s.flower_id] = Number(s.total) || 0;
    });

    const enriched = flowers
      .map((f) => {
        const stock_available = stockMap[f.flower_id] || 0;
        const isSoldOut = stock_available <= 0;
        return {
          ...f.toJSON(),
          stock_available,
          isSoldOut,
        };
      })
      .sort((a, b) => {
        if (a.isSoldOut && !b.isSoldOut) return 1;
        if (!a.isSoldOut && b.isSoldOut) return -1;
        return a.variety.localeCompare(b.variety);
      });

    console.log("🧮 Stock Map (search):", stockMap);
    res.json(enriched);
  } catch (error) {
    console.error("❌ Error performing search:", error.message);
    res.status(500).json({
      message: "Error searching flowers",
      details: error.message,
    });
  }
});

// ========================================
// 🌸 Get Single Flower with Live Stock
// ========================================
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const today = new Date();

    const flower = await Flower.findByPk(id, {
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

    // 🧮 Live stock: only coldroom + not expired + not archived
    const totalStock = await Inventory.sum("stemsInColdroom", {
      include: [
        {
          model: HarvestBatch,
          attributes: [],
          where: {
            flower_id: id,
            status: "InColdroom",
            [Op.or]: [
              { expiryDate: { [Op.gt]: today } },
              { expiryDate: null }, // ✅ counts batches without expiry
            ],
          },
          required: true,
        },
      ],
      where: {
        archived: 0,
        status: { [Op.ne]: "Expired" },
      },
      subQuery: false,
    });

    const stock_available = Number(totalStock) || 0;

    res.json({
      ...flower.toJSON(),
      stock_available,
    });
  } catch (error) {
    console.error("❌ Error fetching flower details:", error.message);
    res.status(500).json({
      message: "Error fetching flower details",
      details: error.message,
    });
  }
});

module.exports = router;
