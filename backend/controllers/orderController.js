const {
  sequelize,
  Order,
  OrderItem,
  Flower,
  HarvestBatch,
  Inventory,
  ColdroomReservation,
} = require("../models");
const { Op } = require("sequelize");

// Create order (customer)
exports.createOrder = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { user_id, pickupOrDelivery, pickupStoreID, shippingAddress, items } =
      req.body;

    const order = await Order.create(
      {
        user_id,
        pickupOrDelivery,
        pickupStoreID,
        shippingAddress,
        status: "Pending",
      },
      { transaction: t }
    );

    for (const it of items) {
      await OrderItem.create(
        {
          order_id: order.order_id,
          flower_id: it.flower_id,
          quantityOrdered: it.qty,
          unitPrice: it.unitPrice,
        },
        { transaction: t }
      );
    }

    await t.commit();
    res.json(order);
  } catch (e) {
    await t.rollback();
    res.status(400).json({ error: e.message });
  }
};

// Reserve stock against batches FIFO
exports.reserveOrder = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const order = await Order.findByPk(req.params.order_id, {
      include: [OrderItem],
      transaction: t,
    });
    if (!order) return res.status(404).json({ error: "Order not found" });

    for (const item of order.OrderItems) {
      let qtyToReserve = item.quantityOrdered;

      // find batches of this flower with available stock
      const batches = await HarvestBatch.findAll({
        where: {
          flower_id: item.flower_id,
          status: { [Op.in]: ["InColdroom", "PartiallyShipped"] },
        },
        include: [Inventory],
        order: [["harvestDateTime", "ASC"]],
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      for (const b of batches) {
        const available = b.Inventory?.stemsInColdroom || 0;
        if (available <= 0) continue;

        const take = Math.min(available, qtyToReserve);

        // create reservation
        await ColdroomReservation.create(
          {
            orderItem_id: item.orderItem_id,
            harvestBatch_id: b.harvestBatch_id,
            quantityReserved: take,
          },
          { transaction: t }
        );

        // decrement inventory immediately on reserve (simple approach)
        b.Inventory.stemsInColdroom = available - take;
        await b.Inventory.save({ transaction: t });

        item.reservedQuantity += take;
        await item.save({ transaction: t });

        qtyToReserve -= take;
        if (qtyToReserve === 0) break;
      }
      if (qtyToReserve > 0) throw new Error("Insufficient stock to reserve");
    }

    order.status = "Reserved";
    order.reservedAt = new Date();
    await order.save({ transaction: t });

    await t.commit();
    res.json({ ok: true, order_id: order.order_id });
  } catch (e) {
    await t.rollback();
    res.status(400).json({ error: e.message });
  }
};

// Fulfil: mark reservations fulfilled; items -> Fulfilled; order -> Shipped
exports.fulfilOrder = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const order = await Order.findByPk(req.params.order_id, {
      include: [{ model: OrderItem, include: [ColdroomReservation] }],
      transaction: t,
    });
    if (!order) return res.status(404).json({ error: "Order not found" });

    for (const item of order.OrderItems) {
      await ColdroomReservation.update(
        { status: "Fulfilled" },
        { where: { orderItem_id: item.orderItem_id }, transaction: t }
      );
      item.reservationStatus = "Fulfilled";
      await item.save({ transaction: t });
    }

    order.status = "Shipped";
    await order.save({ transaction: t });

    await t.commit();
    res.json({ ok: true });
  } catch (e) {
    await t.rollback();
    res.status(400).json({ error: e.message });
  }
};

// Cancel: release reservations back to inventory
exports.cancelOrder = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const order = await Order.findByPk(req.params.order_id, {
      include: [{ model: OrderItem, include: [ColdroomReservation] }],
      transaction: t,
    });
    if (!order) return res.status(404).json({ error: "Order not found" });

    for (const item of order.OrderItems) {
      const reservations = await ColdroomReservation.findAll({
        where: { orderItem_id: item.orderItem_id, status: "Active" },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      for (const r of reservations) {
        const inv = await Inventory.findOne({
          where: { harvestBatch_id: r.harvestBatch_id },
          transaction: t,
          lock: t.LOCK.UPDATE,
        });
        inv.stemsInColdroom += r.quantityReserved;
        await inv.save({ transaction: t });

        r.status = "Released";
        await r.save({ transaction: t });
      }

      item.reservationStatus = "Cancelled";
      await item.save({ transaction: t });
    }

    order.status = "Cancelled";
    await order.save({ transaction: t });

    await t.commit();
    res.json({ ok: true });
  } catch (e) {
    await t.rollback();
    res.status(400).json({ error: e.message });
  }
};
