const express = require("express");
const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());

// Example test route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
