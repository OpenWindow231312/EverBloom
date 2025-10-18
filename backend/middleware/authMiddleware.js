// ========================================
// 🌸 EverBloom — Auth Middleware
// ========================================
const jwt = require("jsonwebtoken");
const { User, Role, UserRole } = require("../models");

// ✅ Check if user is logged in
const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(401).json({ error: "Missing or invalid token" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");

    const user = await User.findByPk(decoded.user_id, {
      include: { model: Role, through: { attributes: [] } },
    });

    if (!user) return res.status(401).json({ error: "User not found" });

    req.user = {
      user_id: user.user_id,
      roles: user.Roles.map((r) => r.roleName),
    };
    next();
  } catch (err) {
    console.error("❌ Auth error:", err.message);
    return res.status(401).json({ error: "Unauthorized" });
  }
};

// ✅ Restrict route by role(s)
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.roles)
      return res.status(403).json({ error: "Access denied" });

    const hasAccess = req.user.roles.some((r) => allowedRoles.includes(r));

    if (!hasAccess)
      return res.status(403).json({ error: "Forbidden: insufficient role" });

    next();
  };
};

module.exports = { requireAuth, requireRole };
