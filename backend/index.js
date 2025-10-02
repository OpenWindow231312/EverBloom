require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path"); // ✅ Needed for serving React build
const { sequelize } = require("./models");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/discards", require("./routes/discardRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));

// Health check
app.get("/health", (_req, res) => res.json({ ok: true }));

// ✅ Serve React frontend in production
if (process.env.NODE_ENV === "production") {
  const clientBuildPath = path.join(__dirname, "client", "build");
  app.use(express.static(clientBuildPath));

  // React Router fallback
  app.get("*", (req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
}

// Start server
const PORT = process.env.PORT || 5001;

sequelize
  .authenticate()
  .then(() => console.log("✅ DB connected"))
  .catch((e) => console.error("❌ DB connection error:", e.message));

app.listen(PORT, () => console.log(`🚀 EverBloom API running on port ${PORT}`));
