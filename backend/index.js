require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// Simple healthcheck
app.get("/api/ping", (req, res) => res.json({ pong: true }));

// Get users
app.get("/api/users", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, name, email FROM users ORDER BY id ASC"
    );
    res.json(rows);
  } catch (err) {
    console.error("DB error (GET /api/users):", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Create user
app.post("/api/users", async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email)
    return res.status(400).json({ error: "name and email required" });

  try {
    const [result] = await db.query(
      "INSERT INTO users (name, email) VALUES (?, ?)",
      [name, email]
    );
    res.status(201).json({ id: result.insertId, name, email });
  } catch (err) {
    console.error("DB error (POST /api/users):", err);
    // handle duplicate email gracefully
    if (err && err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: "Database error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
