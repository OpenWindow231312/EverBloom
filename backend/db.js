// ========================================
// 🌸 EverBloom — Database Connection (Dual Mode)
// ========================================
require("dotenv").config();
const { Sequelize } = require("sequelize");

const isProduction = process.env.NODE_ENV === "production";

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || "mysql",
    logging: false,

    // 👇 Enable SSL only in production (AlwaysData)
    dialectOptions: isProduction
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : {},
  }
);

// ✅ Test connection on startup
(async () => {
  try {
    await sequelize.authenticate();
    console.log(
      `✅ Database connected successfully (${
        isProduction ? "AlwaysData" : "Localhost"
      }).`
    );
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
  }
})();

module.exports = sequelize;
