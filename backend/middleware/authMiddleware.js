const jwt = require("jsonwebtoken");

exports.requireAuth = (req, res, next) => {
  const hdr = req.headers.authorization || "";
  const token = hdr.replace("Bearer ", "");

  // dev helper still supported
  if (process.env.NODE_ENV !== "production" && token === "test") {
    req.user = { user_id: 0, roles: ["Admin", "Employee", "Customer"] };
    return next();
  }

  if (!token) return res.status(401).json({ error: "No token" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || "dev");
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};

exports.requireRole =
  (...roles) =>
  (req, res, next) => {
    const userRoles = req.user?.roles || [];
    if (roles.some((r) => userRoles.includes(r))) return next();
    return res.status(403).json({ error: "Forbidden" });
  };
