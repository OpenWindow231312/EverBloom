// ========================================
// 🌸 EverBloom — Delivery Controller
// ========================================

// ✅ Direct model imports
const Delivery = require("../models/Delivery");
const Order = require("../models/Order");
const User = require("../models/User");

// ===============================
// 🚚 Create a New Delivery
// ===============================
exports.createDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.create(req.body);
    res.status(201).json({
      message: "✅ Delivery created successfully",
      data: delivery,
    });
  } catch (err) {
    console.error("❌ Error creating delivery:", err);
    res.status(500).json({ error: err.message });
  }
};

// ===============================
// 📦 Get All Deliveries
// ===============================
exports.getAllDeliveries = async (_req, res) => {
  try {
    const deliveries = await Delivery.findAll({
      include: [Order, User],
      order: [["createdAt", "DESC"]],
    });
    res.json(deliveries);
  } catch (err) {
    console.error("❌ Error fetching deliveries:", err);
    res.status(500).json({ error: err.message });
  }
};

// ===============================
// 🔄 Update Delivery Status
// ===============================
exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const [updated] = await Delivery.update(
      { status },
      { where: { delivery_id: id } }
    );

    if (!updated) {
      return res.status(404).json({ error: "Delivery not found" });
    }

    res.json({ message: "✅ Delivery status updated successfully" });
  } catch (err) {
    console.error("❌ Error updating delivery status:", err);
    res.status(500).json({ error: err.message });
  }
};
