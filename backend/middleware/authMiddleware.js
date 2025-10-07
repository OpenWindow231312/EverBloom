const jwt = require("jsonwebtoken");

// ========================
// 🧩 Authentication Middleware
// ========================
const requireAuth = (req, res, next) => {
  const hdr = req.headers.authorization || "";
  const token = hdr.replace("Bearer ", "");

  // 🧪 Dev helper token
  if (process.env.NODE_ENV !== "production" && token === "test") {
    req.user = {
      user_id: 0,
      roles: ["Admin", "Employee", "Florist", "Customer"],
    };
    return next();
  }

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    // Verify and attach user data to req.user
    req.user = jwt.verify(token, process.env.JWT_SECRET || "dev");
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// ========================
// 🧩 Role Authorization Middleware
// ========================
// ✅ Now expects an array: requireRole(["Admin","Employee"])
// This ensures proper argument passing from Express
const requireRole = (allowedRoles = []) => {
  return (req, res, next) => {
    const userRoles = req.user?.roles || [];

    // If the user has any of the allowed roles, continue
    const hasPermission = allowedRoles.some((r) => userRoles.includes(r));
    if (hasPermission) return next();

    return res
      .status(403)
      .json({ error: "Forbidden: insufficient privileges" });
  };
};

// ========================
// ✅ Exports
// ========================
module.exports = {
  requireAuth,
  requireRole,
};
