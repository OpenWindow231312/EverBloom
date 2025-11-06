require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { sequelize } = require("./models"); // Sequelize instance + models

const app = express();

// ========================
// 🌸 EverBloom — CORS Configuration (Render + Custom Domain)
// ========================
const allowedOrigins = [
  "https://everbloomshop.co.za",
  "https://www.everbloomshop.co.za",
  "https://everbloom-frontend.vercel.app",
  "http://localhost:5173", // dev mode
  "http://localhost:3000", // optional dev port
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow no-origin requests (like Postman or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.warn("❌ Blocked by CORS:", origin);
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Handle preflight (important for Render)
app.options("*", cors());

// ========================
// 🪵 Logging & Body Parsing
// ========================
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use(express.json({ limit: "2mb" }));
app.set("trust proxy", true); // safe for Render, Vercel, etc.

// ========================
// 🛣️ API Routes
// ========================

// Core functional routes
app.use("/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/flowers", require("./routes/flowerRoutes"));
app.use("/api/harvests", require("./routes/harvestRoutes"));
app.use("/api/inventory", require("./routes/inventoryRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/discards", require("./routes/discardRoutes"));
app.use("/api/deliveries", require("./routes/deliveryRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));

// Dashboard + stock
app.use("/api/stock", require("./routes/stockRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));

// 🛍️ Public shop routes
app.use("/api/shop", require("./routes/shopRoutes"));

// ========================
// 💓 Health + Root
// ========================
app.get("/health", (_req, res) =>
  res.json({ status: "ok", message: "🌿 EverBloom backend running smoothly" })
);

app.get("/", (_req, res) =>
  res.json({
    message: "🌸 EverBloom API is live and blooming 🌷",
    environment: process.env.NODE_ENV || "development",
    status: "OK",
  })
);

// ========================
// 🧭 Route Logger
// ========================
function listRoutes(app) {
  try {
    console.log("📋 Registered API Routes:");
    app._router.stack
      .filter((r) => r.route)
      .forEach((r) =>
        console.log(
          `  ➜ ${Object.keys(r.route.methods)[0].toUpperCase()} ${r.route.path}`
        )
      );
  } catch {
    // no-op
  }
}

// ========================
// 🚀 Start Server + Connect DB
// ========================
const PORT = process.env.PORT || 5001;

(async () => {
  try {
    console.log("⏳ Connecting to database...");
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");

    // Controlled sync — only if explicitly enabled
    if (String(process.env.DB_SYNC).toLowerCase() === "true") {
      await sequelize.sync({ alter: true });
      console.log("✅ Database synced (alter: true)");
    } else {
      console.log("ℹ️ Skipping sequelize.sync() (DB_SYNC not enabled)");
    }

    listRoutes(app);

    app.listen(PORT, () => {
      console.log(`🚀 EverBloom API running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Database connection error:", err.message);
    process.exit(1);
  }
})();

// ========================
// ⚠️ Global Error Handling
// ========================
app.use((req, res) =>
  res.status(404).json({ error: "Not found", path: req.originalUrl })
);

app.use((err, req, res, _next) => {
  console.error("🔥 Server Error:", err);
  res.status(err.status || 500).json({
    error: "Internal server error",
    details: err.message,
  });
});

module.exports = app;
