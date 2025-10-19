const express = require("express");
const router = express.Router();

// temporary placeholder
router.get("/", (req, res) => {
  res.json({ message: "🌾 Harvest routes placeholder active" });
});

module.exports = router;
