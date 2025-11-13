// ========================================
// 🌸 EverBloom — User Profile Routes
// ========================================
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { User, Address, PaymentMethod } = require("../models");
const authMiddleware = require("../middleware/authMiddleware");

// Configure multer for profile photo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads/profiles");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${req.user.user_id}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// ========================================
// 👤 GET USER PROFILE
// GET /api/profile
// ========================================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.user_id, {
      attributes: ["user_id", "fullName", "email", "profilePhoto", "phone"],
      include: [
        {
          model: Address,
          attributes: ["address_id", "addressType", "fullName", "streetAddress", "city", "province", "postalCode", "country", "phone", "isDefault"],
        },
        {
          model: PaymentMethod,
          attributes: ["payment_id", "cardholderName", "cardType", "lastFourDigits", "expiryMonth", "expiryYear", "isDefault"],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error("❌ Get profile error:", error);
    res.status(500).json({ error: "Failed to retrieve profile" });
  }
});

// ========================================
// 📝 UPDATE USER PROFILE
// PUT /api/profile
// ========================================
router.put("/", authMiddleware, async (req, res) => {
  try {
    const { fullName, phone } = req.body;
    
    const user = await User.findByPk(req.user.user_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (fullName) user.fullName = fullName;
    if (phone !== undefined) user.phone = phone;

    await user.save();

    res.json({ message: "Profile updated successfully", user: {
      user_id: user.user_id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      profilePhoto: user.profilePhoto,
    }});
  } catch (error) {
    console.error("❌ Update profile error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// ========================================
// 📷 UPLOAD PROFILE PHOTO
// POST /api/profile/photo
// ========================================
router.post("/photo", authMiddleware, upload.single("profilePhoto"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const user = await User.findByPk(req.user.user_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete old photo if exists
    if (user.profilePhoto) {
      const oldPhotoPath = path.join(__dirname, "../uploads/profiles", path.basename(user.profilePhoto));
      if (fs.existsSync(oldPhotoPath)) {
        fs.unlinkSync(oldPhotoPath);
      }
    }

    // Save new photo path
    user.profilePhoto = `/uploads/profiles/${req.file.filename}`;
    await user.save();

    res.json({ 
      message: "Profile photo updated successfully",
      profilePhoto: user.profilePhoto,
    });
  } catch (error) {
    console.error("❌ Upload photo error:", error);
    res.status(500).json({ error: "Failed to upload photo" });
  }
});

// ========================================
// 🏠 ADDRESS MANAGEMENT
// ========================================

// Get all addresses
router.get("/addresses", authMiddleware, async (req, res) => {
  try {
    const addresses = await Address.findAll({
      where: { user_id: req.user.user_id },
    });
    res.json({ addresses });
  } catch (error) {
    console.error("❌ Get addresses error:", error);
    res.status(500).json({ error: "Failed to retrieve addresses" });
  }
});

// Add new address
router.post("/addresses", authMiddleware, async (req, res) => {
  try {
    const { addressType, fullName, streetAddress, city, province, postalCode, country, phone, isDefault } = req.body;

    if (!fullName || !streetAddress || !city || !province || !postalCode) {
      return res.status(400).json({ error: "Required address fields are missing" });
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      await Address.update(
        { isDefault: false },
        { where: { user_id: req.user.user_id } }
      );
    }

    const address = await Address.create({
      user_id: req.user.user_id,
      addressType: addressType || "Shipping",
      fullName,
      streetAddress,
      city,
      province,
      postalCode,
      country: country || "South Africa",
      phone,
      isDefault: isDefault || false,
    });

    res.json({ message: "Address added successfully", address });
  } catch (error) {
    console.error("❌ Add address error:", error);
    res.status(500).json({ error: "Failed to add address" });
  }
});

// Update address
router.put("/addresses/:id", authMiddleware, async (req, res) => {
  try {
    const address = await Address.findOne({
      where: { address_id: req.params.id, user_id: req.user.user_id },
    });

    if (!address) {
      return res.status(404).json({ error: "Address not found" });
    }

    const { addressType, fullName, streetAddress, city, province, postalCode, country, phone, isDefault } = req.body;

    // If setting as default, unset other defaults
    if (isDefault) {
      await Address.update(
        { isDefault: false },
        { where: { user_id: req.user.user_id } }
      );
    }

    await address.update({
      addressType: addressType || address.addressType,
      fullName: fullName || address.fullName,
      streetAddress: streetAddress || address.streetAddress,
      city: city || address.city,
      province: province || address.province,
      postalCode: postalCode || address.postalCode,
      country: country || address.country,
      phone: phone !== undefined ? phone : address.phone,
      isDefault: isDefault !== undefined ? isDefault : address.isDefault,
    });

    res.json({ message: "Address updated successfully", address });
  } catch (error) {
    console.error("❌ Update address error:", error);
    res.status(500).json({ error: "Failed to update address" });
  }
});

// Delete address
router.delete("/addresses/:id", authMiddleware, async (req, res) => {
  try {
    const address = await Address.findOne({
      where: { address_id: req.params.id, user_id: req.user.user_id },
    });

    if (!address) {
      return res.status(404).json({ error: "Address not found" });
    }

    await address.destroy();
    res.json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error("❌ Delete address error:", error);
    res.status(500).json({ error: "Failed to delete address" });
  }
});

// ========================================
// 💳 PAYMENT METHOD MANAGEMENT
// ========================================

// Get all payment methods
router.get("/payment-methods", authMiddleware, async (req, res) => {
  try {
    const paymentMethods = await PaymentMethod.findAll({
      where: { user_id: req.user.user_id },
    });
    res.json({ paymentMethods });
  } catch (error) {
    console.error("❌ Get payment methods error:", error);
    res.status(500).json({ error: "Failed to retrieve payment methods" });
  }
});

// Add new payment method
router.post("/payment-methods", authMiddleware, async (req, res) => {
  try {
    const { cardholderName, cardType, lastFourDigits, expiryMonth, expiryYear, isDefault } = req.body;

    if (!cardholderName || !lastFourDigits || !expiryMonth || !expiryYear) {
      return res.status(400).json({ error: "Required card fields are missing" });
    }

    // Validate expiry
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
      return res.status(400).json({ error: "Card has expired" });
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      await PaymentMethod.update(
        { isDefault: false },
        { where: { user_id: req.user.user_id } }
      );
    }

    const paymentMethod = await PaymentMethod.create({
      user_id: req.user.user_id,
      cardholderName,
      cardType: cardType || "Visa",
      lastFourDigits: lastFourDigits.slice(-4),
      expiryMonth,
      expiryYear,
      isDefault: isDefault || false,
    });

    res.json({ message: "Payment method added successfully", paymentMethod });
  } catch (error) {
    console.error("❌ Add payment method error:", error);
    res.status(500).json({ error: "Failed to add payment method" });
  }
});

// Delete payment method
router.delete("/payment-methods/:id", authMiddleware, async (req, res) => {
  try {
    const paymentMethod = await PaymentMethod.findOne({
      where: { payment_id: req.params.id, user_id: req.user.user_id },
    });

    if (!paymentMethod) {
      return res.status(404).json({ error: "Payment method not found" });
    }

    await paymentMethod.destroy();
    res.json({ message: "Payment method deleted successfully" });
  } catch (error) {
    console.error("❌ Delete payment method error:", error);
    res.status(500).json({ error: "Failed to delete payment method" });
  }
});

module.exports = router;
