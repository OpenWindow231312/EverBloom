const { Review, Order } = require("../models");

// Add new review
exports.addReview = async (req, res) => {
  try {
    const review = await Review.create(req.body);
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all reviews
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({ include: [Order] });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
