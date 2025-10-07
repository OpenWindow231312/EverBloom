const { Delivery, Order, User } = require("../models");

// Create delivery
exports.createDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.create(req.body);
    res.status(201).json(delivery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all deliveries
exports.getAllDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.findAll({ include: [Order, User] });
    res.json(deliveries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update delivery status
exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await Delivery.update({ status }, { where: { delivery_id: id } });
    res.json({ message: "Delivery status updated." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
