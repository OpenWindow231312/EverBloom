require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const { sequelize } = require("./models");

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/discards", require("./routes/discardRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));

app.get("/health", (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 5001;
sequelize
  .authenticate()
  .then(() => console.log("✅ DB connected"))
  .catch((e) => console.error("❌ DB connection error:", e.message));

app.listen(PORT, () =>
  console.log(`🚀 EverBloom API on http://localhost:${PORT}`)
);
