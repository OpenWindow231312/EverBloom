// ========================================
// 🌸 EverBloom — Authentication Routes (Final Fixed)
// ========================================
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { User, Role, UserRole } = require("../models");
const { sendOTP, verifyOTP } = require("../utils/emailService");
const { authLimiter, otpLimiter } = require("../middleware/rateLimiter");

// ========================================
// 🔐 Helper to sign JWT
// ========================================
const signToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET || "everbloom_secret", {
    expiresIn: "7d",
  });

// ========================================
// 📧 SEND OTP FOR EMAIL VERIFICATION
// POST /api/auth/send-otp
// ========================================
router.post("/send-otp", otpLimiter, async (req, res) => {
  try {
    const { email, fullName } = req.body;

    if (!email || !fullName) {
      return res.status(400).json({ error: "Email and name are required" });
    }

    // Check if email is already registered
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const result = await sendOTP(email, fullName);
    res.json({ message: result.message });
  } catch (error) {
    console.error("❌ Send OTP error:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ 
      error: "Failed to send verification code",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ========================================
// ✅ VERIFY OTP
// POST /api/auth/verify-otp
// ========================================
router.post("/verify-otp", authLimiter, async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    const result = verifyOTP(email, otp);
    
    if (result.valid) {
      res.json({ message: result.message, verified: true });
    } else {
      res.status(400).json({ error: result.message, verified: false });
    }
  } catch (error) {
    console.error("❌ Verify OTP error:", error);
    res.status(500).json({ error: "Failed to verify OTP" });
  }
});

// ========================================
// 🪴 REGISTER USER (with role + discount logic)
// POST /api/auth/register
// ========================================
router.post("/register", authLimiter, async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    if (!fullName || !email || !password || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // 1️⃣ Check for existing user
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // 2️⃣ Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // 3️⃣ Create user
    const newUser = await User.create({
      fullName,
      email,
      passwordHash,
      isActive: true,
    });

    // 4️⃣ Find or create role
    let selectedRole = await Role.findOne({ where: { roleName: role } });
    if (!selectedRole) {
      // Create the role if it doesn't exist
      selectedRole = await Role.create({ roleName: role });
    }

    // 5️⃣ Link role to user
    await UserRole.create({
      user_id: newUser.user_id,
      role_id: selectedRole.role_id,
    });

    // 6️⃣ Optional: florist discount
    const discount = role === "Florist" ? 0.1 : 0.0;
    const roles = [role];

    // 7️⃣ Sign token
    const token = signToken({
      user_id: newUser.user_id,
      roles,
      discount,
    });

    res.json({
      message: "✅ User registered successfully",
      token,
      user: {
        user_id: newUser.user_id,
        fullName: newUser.fullName,
        email: newUser.email,
        roles,
        discount,
      },
    });
  } catch (err) {
    console.error("❌ Register error:", err);
    console.error("Error details:", {
      message: err.message,
      stack: err.stack,
      name: err.name
    });
    res.status(500).json({ 
      error: "Server error during registration",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// ========================================
// 🔹 LOGIN USER
// POST /api/auth/login
// ========================================
router.post("/login", authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: Role,
          through: { attributes: [] },
          attributes: ["roleName"],
        },
      ],
    });

    if (!user)
      return res.status(400).json({ error: "Invalid email or password" });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match)
      return res.status(400).json({ error: "Invalid email or password" });

    const roles = user.Roles?.map((r) => r.roleName) || [];
    const discount = roles.includes("Florist") ? 0.1 : 0.0;

    const token = signToken({ user_id: user.user_id, roles, discount });

    res.json({
      message: "✅ Login successful",
      token,
      user: {
        user_id: user.user_id,
        fullName: user.fullName,
        email: user.email,
        roles,
        discount,
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    console.error("Error details:", {
      message: err.message,
      stack: err.stack,
      name: err.name
    });
    res.status(500).json({
      error: "Server error during login",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// ========================================
// 🔹 GET CURRENT USER / VERIFY TOKEN
// GET /api/auth/me
// ========================================
router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ error: "Authorization header missing" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "everbloom_secret"
    );

    const user = await User.findByPk(decoded.user_id, {
      attributes: ["user_id", "fullName", "email"],
      include: [
        {
          model: Role,
          through: { attributes: [] },
          attributes: ["roleName"],
        },
      ],
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    const roles = user.Roles?.map((r) => r.roleName) || [];
    const discount = roles.includes("Florist") ? 0.1 : 0.0;

    res.json({
      user: {
        user_id: user.user_id,
        fullName: user.fullName,
        email: user.email,
        roles,
        discount,
      },
    });
  } catch (err) {
    console.error("❌ Auth check error:", err);
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

module.exports = router;
