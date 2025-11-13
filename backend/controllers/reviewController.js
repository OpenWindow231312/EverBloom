// ========================================
// 🌸 EverBloom — Review Controller (Flower Reviews)
// ========================================

const { Review, User, Flower } = require("../models");
const path = require("path");
const fs = require("fs");

// ===============================
// ✍️ Add New Review
// ===============================
exports.addReview = async (req, res) => {
  try {
    const { flower_id, rating, heading, comment } = req.body;
    const user_id = req.user.user_id;

    // Validate required fields
    if (!flower_id || !rating) {
      return res.status(400).json({ error: "Flower ID and rating are required" });
    }

    // Check if flower exists
    const flower = await Flower.findByPk(flower_id);
    if (!flower) {
      return res.status(404).json({ error: "Flower not found" });
    }

    // Handle image upload if present
    let image_url = null;
    if (req.file) {
      image_url = `/uploads/reviews/${req.file.filename}`;
    }

    const review = await Review.create({
      flower_id,
      user_id,
      rating,
      heading,
      comment,
      image_url
    });

    // Fetch the created review with user details
    const createdReview = await Review.findByPk(review.review_id, {
      include: [
        {
          model: User,
          attributes: ['user_id', 'fullName', 'profilePhoto']
        }
      ]
    });

    res.status(201).json(createdReview);
  } catch (err) {
    console.error("❌ Error adding review:", err);
    res.status(500).json({ error: err.message });
  }
};

// ===============================
// 📖 Get Reviews for a Flower
// ===============================
exports.getFlowerReviews = async (req, res) => {
  try {
    const { flowerId } = req.params;

    const reviews = await Review.findAll({
      where: { flower_id: flowerId },
      include: [
        {
          model: User,
          attributes: ['user_id', 'fullName', 'profilePhoto']
        }
      ],
      order: [["createdAt", "DESC"]]
    });

    // Calculate average rating
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    res.json({
      reviews,
      averageRating: avgRating.toFixed(1),
      totalReviews: reviews.length
    });
  } catch (err) {
    console.error("❌ Error fetching flower reviews:", err);
    res.status(500).json({ error: err.message });
  }
};

// ===============================
// 📖 Get User's Reviews
// ===============================
exports.getUserReviews = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const reviews = await Review.findAll({
      where: { user_id },
      include: [
        {
          model: Flower,
          attributes: ['flower_id', 'variety', 'image_url']
        }
      ],
      order: [["createdAt", "DESC"]]
    });

    res.json(reviews);
  } catch (err) {
    console.error("❌ Error fetching user reviews:", err);
    res.status(500).json({ error: err.message });
  }
};

// ===============================
// ✏️ Update Review
// ===============================
exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const user_id = req.user.user_id;
    const { rating, heading, comment } = req.body;

    const review = await Review.findByPk(reviewId);
    
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Check ownership
    if (review.user_id !== user_id) {
      return res.status(403).json({ error: "You can only edit your own reviews" });
    }

    // Handle image upload if present
    let image_url = review.image_url;
    if (req.file) {
      // Delete old image if exists
      if (review.image_url) {
        const oldImagePath = path.join(__dirname, '..', review.image_url);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      image_url = `/uploads/reviews/${req.file.filename}`;
    }

    await review.update({
      rating,
      heading,
      comment,
      image_url
    });

    // Fetch updated review with user details
    const updatedReview = await Review.findByPk(reviewId, {
      include: [
        {
          model: User,
          attributes: ['user_id', 'fullName', 'profilePhoto']
        }
      ]
    });

    res.json(updatedReview);
  } catch (err) {
    console.error("❌ Error updating review:", err);
    res.status(500).json({ error: err.message });
  }
};

// ===============================
// 🗑️ Delete Review
// ===============================
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const user_id = req.user.user_id;

    const review = await Review.findByPk(reviewId);
    
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Check ownership
    if (review.user_id !== user_id) {
      return res.status(403).json({ error: "You can only delete your own reviews" });
    }

    // Delete image if exists
    if (review.image_url) {
      const imagePath = path.join(__dirname, '..', review.image_url);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await review.destroy();
    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting review:", err);
    res.status(500).json({ error: err.message });
  }
};

// ===============================
// 📧 Admin Follow-up Email (Mock)
// ===============================
exports.sendFollowUpEmail = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { message } = req.body;

    // Check if user is admin
    const isAdmin = req.user.roles.includes('Admin');
    if (!isAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }

    const review = await Review.findByPk(reviewId, {
      include: [
        {
          model: User,
          attributes: ['user_id', 'fullName', 'email']
        }
      ]
    });

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Mock email sending
    // In production, you would use nodemailer or similar service
    const emailData = {
      to: review.User.email,
      subject: "EverBloom - Following up on your review",
      message: message,
      timestamp: new Date().toISOString()
    };

    console.log("📧 Mock Email Sent:", emailData);

    res.json({
      success: true,
      message: "Follow-up email sent successfully",
      recipient: review.User.email
    });
  } catch (err) {
    console.error("❌ Error sending follow-up email:", err);
    res.status(500).json({ error: err.message });
  }
};

// ===============================
// 📖 Get All Reviews (Admin)
// ===============================
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      include: [
        {
          model: User,
          attributes: ['user_id', 'fullName', 'email', 'profilePhoto']
        },
        {
          model: Flower,
          attributes: ['flower_id', 'variety', 'image_url']
        }
      ],
      order: [["createdAt", "DESC"]]
    });
    res.json(reviews);
  } catch (err) {
    console.error("❌ Error fetching reviews:", err);
    res.status(500).json({ error: err.message });
  }
};
