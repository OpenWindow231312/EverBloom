// ========================================
// 🌸 EverBloom — Review Routes
// ========================================
const express = require("express");
const router = express.Router();

// ✅ Import controller directly
const reviewController = require("../controllers/reviewController");

// ===============================
// ➕ Add a new review
// ===============================
router.post("/", async (req, res) => {
  try {
    await reviewController.addReview(req, res);
  } catch (err) {
    console.error("❌ Error adding review:", err);
    res
      .status(500)
      .json({ message: "Failed to add review", error: err.message });
  }
});

// ===============================
// 📖 Get all reviews
// ===============================
router.get("/", async (req, res) => {
  try {
    await reviewController.getAllReviews(req, res);
  } catch (err) {
    console.error("❌ Error fetching reviews:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch reviews", error: err.message });
  }
});

module.exports = router;
