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

// ========================
// 🛣️ API Routes
// ========================
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/discards", require("./routes/discardRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));

// Health Check Route
app.get("/health", (_req, res) => res.json({ ok: true }));

// ========================
// 🌐 Serve React Frontend (Production Only)
// ========================
if (process.env.NODE_ENV === "production") {
  // Path to React build
  const clientBuildPath = path.join(__dirname, "../client", "build");
  app.use(express.static(clientBuildPath));

  // React Router fallback
  app.get("*", (req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
} else {
  // Local development info
  app.get("/", (req, res) => {
    res.send("🌱 EverBloom backend running in development mode");
  });
}

// ========================
// 🚀 Start Server
// ========================
const PORT = process.env.PORT || 5001;

sequelize
  .authenticate()
  .then(() => console.log("✅ Database connected successfully"))
  .catch((err) => console.error("❌ Database connection error:", err.message));

app.listen(PORT, () => console.log(`🚀 EverBloom API running on port ${PORT}`));
