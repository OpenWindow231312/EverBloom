const { sequelize } = require("../models");

exports.getSalesSummary = async (req, res) => {
  try {
    const [results] = await sequelize.query("SELECT * FROM SalesSummary");
    res.json(results);
  } catch (err) {
    console.error("Error fetching Sales Summary:", err);
    res.status(500).json({ error: "Failed to load sales summary" });
  }
};

exports.getLowStockAlerts = async (req, res) => {
  try {
    const [results] = await sequelize.query(
      "SELECT * FROM LowStockAlerts WHERE status = 'Open' ORDER BY createdAt DESC"
    );
    res.json(results);
  } catch (err) {
    console.error("Error fetching Low Stock Alerts:", err);
    res.status(500).json({ error: "Failed to load alerts" });
  }
};

exports.getActivityLogs = async (req, res) => {
  try {
    const [results] = await sequelize.query(
      "SELECT * FROM ActivityLogs ORDER BY createdAt DESC LIMIT 50"
    );
    res.json(results);
  } catch (err) {
    console.error("Error fetching Activity Logs:", err);
    res.status(500).json({ error: "Failed to load logs" });
  }
};

exports.getInventoryOverview = async (req, res) => {
  try {
    const [results] = await sequelize.query("SELECT * FROM FlowerStockView");
    res.json(results);
  } catch (err) {
    console.error("Error fetching Inventory Overview:", err);
    res.status(500).json({ error: "Failed to load inventory" });
  }
};
