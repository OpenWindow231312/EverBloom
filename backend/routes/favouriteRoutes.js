// ========================================
// 🌸 EverBloom — Favourite Routes
// User-specific favourite flowers
// ========================================

const express = require("express");
const router = express.Router();
const { Favourite, Flower, FlowerType } = require("../models");
const { requireAuth } = require("../middleware/authMiddleware");

// 📋 Get all favourites for logged-in user
router.get("/", requireAuth, async (req, res) => {
  try {
    const favourites = await Favourite.findAll({
      where: { user_id: req.user.user_id },
      include: [
        {
          model: Flower,
          include: [FlowerType],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Return just the flower data with favourite_id
    const formattedFavourites = favourites.map((fav) => ({
      favourite_id: fav.favourite_id,
      ...fav.Flower.toJSON(),
    }));

    res.json(formattedFavourites);
  } catch (error) {
    console.error("❌ Error fetching favourites:", error);
    res.status(500).json({ error: "Failed to fetch favourites" });
  }
});

// ➕ Add a flower to favourites
router.post("/", requireAuth, async (req, res) => {
  try {
    const { flower_id } = req.body;

    if (!flower_id) {
      return res.status(400).json({ error: "flower_id is required" });
    }

    // Check if already in favourites
    const existing = await Favourite.findOne({
      where: {
        user_id: req.user.user_id,
        flower_id: flower_id,
      },
    });

    if (existing) {
      return res.status(400).json({ error: "Already in favourites" });
    }

    // Add to favourites
    const favourite = await Favourite.create({
      user_id: req.user.user_id,
      flower_id: flower_id,
    });

    // Fetch the flower data to return
    const favouriteWithFlower = await Favourite.findOne({
      where: { favourite_id: favourite.favourite_id },
      include: [
        {
          model: Flower,
          include: [FlowerType],
        },
      ],
    });

    res.status(201).json({
      favourite_id: favouriteWithFlower.favourite_id,
      ...favouriteWithFlower.Flower.toJSON(),
    });
  } catch (error) {
    console.error("❌ Error adding favourite:", error);
    res.status(500).json({ error: "Failed to add favourite" });
  }
});

// ❌ Remove a flower from favourites
router.delete("/:flower_id", requireAuth, async (req, res) => {
  try {
    const { flower_id } = req.params;

    const deleted = await Favourite.destroy({
      where: {
        user_id: req.user.user_id,
        flower_id: flower_id,
      },
    });

    if (deleted === 0) {
      return res.status(404).json({ error: "Favourite not found" });
    }

    res.json({ message: "Removed from favourites" });
  } catch (error) {
    console.error("❌ Error removing favourite:", error);
    res.status(500).json({ error: "Failed to remove favourite" });
  }
});

module.exports = router;
