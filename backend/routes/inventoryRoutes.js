const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "❄️ Inventory routes placeholder active" });
});

module.exports = router;
