const router = require("express").Router();
const oc = require("../controllers/orderController");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");

router.post(
  "/",
  requireAuth,
  requireRole("Customer", "Admin", "Employee"),
  oc.createOrder
);
router.post(
  "/:order_id/reserve",
  requireAuth,
  requireRole("Admin", "Employee"),
  oc.reserveOrder
);
router.post(
  "/:order_id/fulfil",
  requireAuth,
  requireRole("Admin", "Employee"),
  oc.fulfilOrder
);
router.post(
  "/:order_id/cancel",
  requireAuth,
  requireRole("Admin", "Employee"),
  oc.cancelOrder
);

module.exports = router;
