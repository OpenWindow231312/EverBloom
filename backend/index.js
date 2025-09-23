const express = require("express");
const cors = require("cors");
const sequelize = require("./db");
const User = require("./models/user");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));

sequelize.sync().then(() => {
  console.log("✅ DB synced");
  app.listen(5000, () => console.log("🚀 Server running on port 5000"));
});
