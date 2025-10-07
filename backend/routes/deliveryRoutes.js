const express = require("express");
const router = express.Router();
const deliveryController = require("../controllers/deliveryController");

router.post("/", deliveryController.createDelivery);
router.get("/", deliveryController.getAllDeliveries);
router.put("/:id/status", deliveryController.updateDeliveryStatus);

module.exports = router;
