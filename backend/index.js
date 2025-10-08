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
// 🔧 CORS Middleware (Render-safe version)
// ========================
const allowedOrigins = [
  "https://www.everbloomshop.co.za",
  "https://everbloomshop.co.za",
  "https://everbloom-frontend.vercel.app", // optional: your Vercel domain if used
  "http://localhost:3000",
  "http://localhost:5173",
];

// 🛡️ Set headers manually for all requests (Render friendly)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

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
app.use("/api/stock", require("./routes/stockRoutes"));

// 🌼 Admin Dashboard Routes
app.use("/api/dashboard", require("./routes/dashboardRoutes"));

// ========================
// 🩺 Health Check Route
// ========================
app.get("/health", (_req, res) =>
  res.json({ status: "ok", message: "🌿 EverBloom backend running smoothly" })
);

// ========================
// 🌐 Serve React Frontend (Production)
// ========================
if (process.env.NODE_ENV === "production") {
  const clientBuildPath = path.join(__dirname, "../client", "build");
  app.use(express.static(clientBuildPath));

  app.get("*", (req, res) =>
    res.sendFile(path.join(clientBuildPath, "index.html"))
  );
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

    // Use { alter: true } in dev, avoid on production
    const alter = process.env.NODE_ENV === "development";
    await sequelize.sync({ alter });
    console.log(`✅ Models synchronized (${alter ? "altered" : "safe mode"})`);

    app.listen(PORT, () =>
      console.log(`🚀 EverBloom API live at: http://localhost:${PORT}`)
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
