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

// 🌸 Dashboard Overview Summary
exports.getDashboardOverview = async (req, res) => {
  try {
    const [[users]] = await sequelize.query(
      "SELECT COUNT(*) AS total, SUM(isActive) AS active FROM Users"
    );
    const [[orders]] = await sequelize.query(
      "SELECT COUNT(*) AS total, SUM(status='Pending') AS pending, SUM(status='Delivered') AS completed FROM Orders"
    );
    const [[flowers]] = await sequelize.query(
      "SELECT COUNT(*) AS total FROM Flowers"
    );
    const [[stores]] = await sequelize.query(
      "SELECT COUNT(*) AS total FROM Stores"
    );
    const [[harvestBatches]] = await sequelize.query(
      "SELECT COUNT(*) AS total FROM HarvestBatches"
    );
    const [[reviews]] = await sequelize.query(
      "SELECT COUNT(*) AS total FROM Reviews"
    );
    const [[coldroom]] = await sequelize.query(
      "SELECT SUM(stemsInColdroom) AS total FROM Inventories"
    );

    // Example: flowers with less than 10 stems = low stock
    const [[lowStock]] = await sequelize.query(
      "SELECT COUNT(*) AS count FROM Inventories WHERE stemsInColdroom < 10"
    );

    res.json({
      users: users.total || 0,
      activeUsers: users.active || 0,
      orders: orders.total || 0,
      pendingOrders: orders.pending || 0,
      completedOrders: orders.completed || 0,
      flowers: flowers.total || 0,
      stores: stores.total || 0,
      harvestBatches: harvestBatches.total || 0,
      reviews: reviews.total || 0,
      flowersInColdroom: coldroom.total || 0,
      lowStock: lowStock.count || 0,
    });
  } catch (err) {
    console.error("Dashboard Overview Error:", err);
    res.status(500).json({ error: "Could not load overview data" });
  }
};
