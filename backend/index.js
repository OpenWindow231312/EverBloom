// ========================================
// 🌸 EverBloom Backend — Main Entry Point
// ========================================

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { sequelize } = require("./models"); // Sequelize instance + models

const app = express();

// ========================
// 🔧 CORS Configuration
// ========================
const allowedOrigins = [
  "https://www.everbloomshop.co.za",
  "https://everbloomshop.co.za",
  "https://everbloom-frontend.vercel.app",
  "http://localhost:3000",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow Postman / curl (no origin) and known domains
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("CORS blocked"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
    exposedHeaders: ["Authorization"],
  })
);

// ========================
// 🪵 Logging & Body Parsing
// ========================
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use(express.json({ limit: "1mb" }));
app.set("trust proxy", true); // safe for Render

// ========================
// 🛣️ API Routes
// ========================
app.use("/api/flowers", require("./routes/flowerRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/discards", require("./routes/discardRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/deliveries", require("./routes/deliveryRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/stock", require("./routes/stockRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));

// ========================
// 💓 Health + Root
// ========================
app.get("/health", (_req, res) =>
  res.json({ status: "ok", message: "🌿 EverBloom backend running smoothly" })
);

app.get("/", (_req, res) =>
  res.json({ message: "🌸 EverBloom API is live on Render", status: "OK" })
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
  } catch (e) {
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
  res
    .status(err.status || 500)
    .json({ error: "Internal server error", details: err.message });
});

module.exports = app;
