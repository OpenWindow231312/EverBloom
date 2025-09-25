const { User, Role, UserRole } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

const sign = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET || "dev", { expiresIn: "7d" });

exports.registerValidators = [
  body("fullName").trim().notEmpty(),
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 6 }),
];

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { fullName, email, password } = req.body;
  const existing = await User.findOne({ where: { email } });
  if (existing) return res.status(409).json({ error: "Email already in use" });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    fullName,
    email,
    passwordHash,
    isActive: true,
  });

  // ensure Customer role exists & attach
  let customer = await Role.findOne({ where: { roleName: "Customer" } });
  if (!customer) customer = await Role.create({ roleName: "Customer" });
  await UserRole.create({ user_id: user.user_id, role_id: customer.role_id });

  const roles = ["Customer"];
  const token = sign({ user_id: user.user_id, roles });
  res.json({ token, user: { user_id: user.user_id, fullName, email, roles } });
};

exports.loginValidators = [
  body("email").isEmail().normalizeEmail(),
  body("password").notEmpty(),
];

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  // fetch roles
  const rows = await UserRole.findAll({
    where: { user_id: user.user_id },
    include: [Role],
  });
  const roles = rows.map((r) => r.Role.roleName);

  const token = sign({ user_id: user.user_id, roles });
  res.json({
    token,
    user: {
      user_id: user.user_id,
      fullName: user.fullName,
      email: user.email,
      roles,
    },
  });
};

exports.me = async (req, res) => {
  res.json({ user_id: req.user.user_id, roles: req.user.roles });
};
