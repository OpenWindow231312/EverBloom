// ========================================
// 🌸 EverBloom — Review Routes
// ========================================
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const reviewController = require("../controllers/reviewController");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");
const { apiLimiter, uploadLimiter } = require("../middleware/rateLimiter");

// ===============================
// 📁 Multer Configuration for Review Images
// ===============================
const uploadDir = path.join(__dirname, "..", "uploads", "reviews");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `review-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error("Only image files are allowed (jpeg, jpg, png, gif, webp)"));
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter
});

// ===============================
// ➕ Add a new review (authenticated users)
// ===============================
router.post("/", uploadLimiter, requireAuth, upload.single('reviewImage'), reviewController.addReview);

// ===============================
// 📖 Get reviews for a specific flower (public)
// ===============================
router.get("/flower/:flowerId", reviewController.getFlowerReviews);

// ===============================
// 📖 Get current user's reviews (authenticated)
// ===============================
router.get("/my-reviews", apiLimiter, requireAuth, reviewController.getUserReviews);

// ===============================
// ✏️ Update a review (owner only)
// ===============================
router.put("/:reviewId", uploadLimiter, requireAuth, upload.single('reviewImage'), reviewController.updateReview);

// ===============================
// 🗑️ Delete a review (owner only)
// ===============================
router.delete("/:reviewId", apiLimiter, requireAuth, reviewController.deleteReview);

// ===============================
// 📧 Admin: Send follow-up email (admin only)
// ===============================
router.post("/:reviewId/follow-up", apiLimiter, requireAuth, requireRole("Admin"), reviewController.sendFollowUpEmail);

// ===============================
// 📖 Get all reviews (admin only)
// ===============================
router.get("/", apiLimiter, requireAuth, requireRole("Admin"), reviewController.getAllReviews);

module.exports = router;
