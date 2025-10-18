// ========================================
// 🌸 EverBloom — Review Controller
// ========================================

// ✅ Direct Model Imports
const Review = require("../models/Review");
const Order = require("../models/Order");

// ===============================
// ✍️ Add New Review
// ===============================
exports.addReview = async (req, res) => {
  try {
    const review = await Review.create(req.body);
    res.status(201).json(review);
  } catch (err) {
    console.error("❌ Error adding review:", err);
    res.status(500).json({ error: err.message });
  }
};

// ===============================
// 📖 Get All Reviews
// ===============================
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      include: [Order],
      order: [["createdAt", "DESC"]], // optional: newest first
    });
    res.json(reviews);
  } catch (err) {
    console.error("❌ Error fetching reviews:", err);
    res.status(500).json({ error: err.message });
  }
};
