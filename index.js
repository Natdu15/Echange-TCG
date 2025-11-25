// index.js (BACKEND NODE)
// ========================

import express from "express";
import cors from "cors";
import pkg from "pg";
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

// Render fournit DATABASE_URL automatiquement
// Sinon, utilise ton External URL en local
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Route de login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT id, email FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Email inconnu" });
    }

    // (Pour le moment mot de passe non vérifié)
    if (password.length < 3) {
      return res.status(400).json({ error: "Mot de passe trop court" });
    }

    res.json({
      success: true,
      user: result.rows[0]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Render → PORT fourni automatiquement
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Serveur backend OK sur port " + port);
});
