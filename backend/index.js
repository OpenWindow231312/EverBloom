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
app.use(cors());
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

  // React Router Fallback
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

sequelize
  .authenticate()
  .then(async () => {
    console.log("✅ Database connected successfully");

    // Optional: sync models without dropping tables
    await sequelize.sync({ alter: false });

    app.listen(PORT, () =>
      console.log(`🚀 EverBloom API running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err.message);
  });

// ========================
// ⚠️ Global Error Handling
// ========================
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res
    .status(500)
    .json({ error: "Internal server error", details: err.message });
});
