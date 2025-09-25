const jwt = require("jsonwebtoken");

// DEV MODE: allow any request and give Admin/Employee roles.
// Remove this block once real auth is in.
exports.requireAuth = (req, res, next) => {
  const hdr = req.headers.authorization || "";
  const token = hdr.replace("Bearer ", "");
  if (token === "test") {
    // <<< our curl uses this
    req.user = { roles: ["Admin", "Employee", "Customer"] };
    return next();
  }
  // fallback to real JWT if you already have it
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
