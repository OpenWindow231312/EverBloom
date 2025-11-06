// ========================================
// 🌸 EverBloom — Order Routes (Create + Fetch + Update)
// ========================================
const express = require("express");
const router = express.Router();
const { Order, OrderItem, Flower, User } = require("../models");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");

// 🧾 Get all orders (Admin/Employee)
router.get(
  "/",
  requireAuth,
  requireRole("Admin", "Employee"),
  async (req, res) => {
    try {
      const orders = await Order.findAll({
        include: [
          { model: User, as: "User" },
          {
            model: OrderItem,
            as: "OrderItems",
            include: [{ model: Flower, as: "Flower" }],
          },
        ],
        order: [["order_id", "DESC"]],
      });
      res.json(orders);
    } catch (err) {
      console.error("❌ Error fetching orders:", err);
      res.status(500).json({ message: "Error fetching orders" });
    }
  }
);

// ➕ Create new order from cart
router.post("/", requireAuth, async (req, res) => {
  try {
    const { items, totalAmount, pickupOrDelivery = "Delivery" } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order." });
    }

    // 1️⃣ Create order
    const newOrder = await Order.create({
      user_id: req.user.user_id,
      totalAmount,
      pickupOrDelivery,
      status: "Pending",
    });

    // 2️⃣ Add items
    for (const item of items) {
      await OrderItem.create({
        order_id: newOrder.order_id,
        flower_id: item.flower_id,
        quantityOrdered: item.quantity,
        unitPrice: item.is_on_sale
          ? item.sale_price_per_stem
          : item.price_per_stem,
      });
    }

    // 3️⃣ Fetch populated order
    const fullOrder = await Order.findByPk(newOrder.order_id, {
      include: [
        {
          model: OrderItem,
          as: "OrderItems",
          include: [{ model: Flower, as: "Flower" }],
        },
      ],
    });

    res.status(201).json({
      message: "✅ Order created successfully",
      order: fullOrder,
    });
  } catch (err) {
    console.error("❌ Error creating order:", err);
    res.status(500).json({ message: "Error creating order" });
  }
});

// 🔄 Update order status
router.put(
  "/:order_id",
  requireAuth,
  requireRole("Admin", "Employee"),
  async (req, res) => {
    try {
      const { order_id } = req.params;
      const { status } = req.body;

      const order = await Order.findByPk(order_id);
      if (!order) return res.status(404).json({ message: "Order not found" });

      order.status = status;
      await order.save();

      res.json({ message: "✅ Order status updated", order });
    } catch (err) {
      console.error("❌ Error updating order:", err);
      res.status(500).json({ message: "Error updating order" });
    }
  }
);

module.exports = router;
