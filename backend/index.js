// ========================================
// 🌸 EverBloom Backend — Main Entry Point
// ========================================

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { sequelize } = require("./models");

const app = express();

// ========================
// 🔧 Middleware
// ========================
app.use(
  cors({
    origin: [
      "https://www.everbloomshop.co.za",
      "https://everbloomshop.co.za",
      "http://localhost:5173", // for local Vite frontend
      "http://localhost:3000", // for local CRA frontend (optional)
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========================
// 🛣️ API Routes
// ========================

// 💐 Core Business Routes
app.use("/api/flowers", require("./routes/flowerRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/discards", require("./routes/discardRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/deliveries", require("./routes/deliveryRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));

// 🌿 Stock Management Routes
app.use("/api/stock", require("./routes/stockRoutes")); // ✅ ensure this is defined after imports

// 🌼 Admin Dashboard Routes
app.use("/api/dashboard", require("./routes/dashboardRoutes"));

// ========================
// 🩺 Health Check Route
// ========================
app.get("/health", (_req, res) => res.json({ ok: true }));

// ========================
// 🌐 Serve React Frontend (Production)
// ========================
if (process.env.NODE_ENV === "production") {
  const clientBuildPath = path.join(__dirname, "../client", "build");
  app.use(express.static(clientBuildPath));

  // React Router fallback
  app.get("*", (req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("🌱 EverBloom backend running in development mode");
  });
}

// ========================
// 🚀 Server + Database Init
// ========================
const PORT = process.env.PORT || 5001;

(async () => {
  try {
    console.log("⏳ Connecting to database...");
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");

    // ⚙️ Only use { alter: true } during local development
    await sequelize.sync({ alter: process.env.NODE_ENV === "development" });
    console.log("✅ Models synchronized");

    app.listen(PORT, () =>
      console.log(`🚀 EverBloom API running at http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("❌ Database connection error:", err.message);
    process.exit(1);
  }
})();

// ========================
// ⚠️ Global Error Handling
// ========================
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res.status(500).json({
    error: "Internal server error",
    details: err.message,
  });
});
