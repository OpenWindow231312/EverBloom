// ========================================
// 🌸 EverBloom — Authentication Routes
// ========================================
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { User, Role, UserRole } = require("../models");

// Helper to sign JWT
const signToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET || "dev_secret", {
    expiresIn: "7d",
  });

// ===============================
// 🔹 REGISTER USER
// ===============================
router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password, florist } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ error: "Email already registered" });

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      fullName,
      email,
      passwordHash,
      isActive: true,
    });

    // Assign default role: Customer
    let customerRole = await Role.findOne({ where: { roleName: "Customer" } });
    if (!customerRole)
      customerRole = await Role.create({ roleName: "Customer" });

    await UserRole.create({
      user_id: user.user_id,
      role_id: customerRole.role_id,
    });

    // If florist flag true, also assign Florist role
    if (florist) {
      let floristRole = await Role.findOne({ where: { roleName: "Florist" } });
      if (!floristRole)
        floristRole = await Role.create({ roleName: "Florist" });

      await UserRole.create({
        user_id: user.user_id,
        role_id: floristRole.role_id,
      });
    }

    const roles = florist ? ["Customer", "Florist"] : ["Customer"];
    const token = signToken({ user_id: user.user_id, roles });

    res.json({
      message: "✅ User registered successfully",
      token,
      user: {
        user_id: user.user_id,
        fullName: user.fullName,
        email: user.email,
        roles,
      },
    });
  } catch (err) {
    console.error("❌ Register error:", err);
    res.status(500).json({
      error: "Server error during registration",
      details: err.message,
    });
  }
});

// ===============================
// 🔹 LOGIN USER (FIXED VERSION)
// ===============================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user and include roles directly
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

    // Sign JWT token
    const token = signToken({ user_id: user.user_id, roles });

    res.json({
      message: "✅ Login successful",
      token,
      user: {
        user_id: user.user_id,
        fullName: user.fullName,
        email: user.email,
        roles,
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({
      error: "Server error during login",
      details: err.message,
    });
  }
});

// ===============================
// 🔹 VERIFY TOKEN / CURRENT USER
// ===============================
router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ error: "Authorization header missing" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");

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

    res.json({ user });
  } catch (err) {
    console.error("❌ Auth check error:", err);
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

module.exports = router;
