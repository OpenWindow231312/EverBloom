// ========================================
// 🌸 EverBloom — Authentication Controller
// ========================================

// ✅ Direct imports (no autoloader)
const User = require("../models/User");
const Role = require("../models/Role");
const UserRole = require("../models/UserRole");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

// 🔐 Helper to sign JWT
const sign = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET || "dev_secret_key", {
    expiresIn: "7d",
  });

// =======================
// 🪴 REGISTER USER
// =======================
exports.registerValidators = [
  body("fullName").trim().notEmpty().withMessage("Full name is required"),
  body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullName, email, password, florist } = req.body;

  try {
    // 🕵️ Check if email already exists
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: "Email already in use" });
    }

    // 🔒 Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // 👤 Create user
    const user = await User.create({
      fullName,
      email,
      passwordHash,
      isActive: true,
    });

    // 👥 Assign default role: Customer
    let customer = await Role.findOne({ where: { roleName: "Customer" } });
    if (!customer) customer = await Role.create({ roleName: "Customer" });

    await UserRole.create({
      user_id: user.user_id,
      role_id: customer.role_id,
    });

    // 🌼 Optionally assign Florist role
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
    const token = sign({ user_id: user.user_id, roles });

    res.status(201).json({
      message: "✅ Account created successfully",
      token,
      user: { user_id: user.user_id, fullName, email, roles },
    });
  } catch (err) {
    console.error("❌ Registration Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// =======================
// 🔑 LOGIN
// =======================
exports.loginValidators = [
  body("email").isEmail().normalizeEmail(),
  body("password").notEmpty(),
];

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // 🔍 Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 🔑 Verify password
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 🧩 Fetch roles
    const userRoles = await UserRole.findAll({
      where: { user_id: user.user_id },
      include: [{ model: Role }],
    });

    const roles = userRoles.map((ur) => ur.Role.roleName);

    // 🔏 Sign JWT
    const token = sign({ user_id: user.user_id, roles });

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
    console.error("❌ Login Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// =======================
// 👤 AUTHENTICATED USER INFO
// =======================
exports.me = async (req, res) => {
  res.json({
    user_id: req.user.user_id,
    roles: req.user.roles,
  });
};
