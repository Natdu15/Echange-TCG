import express from "express";
import cors from "cors";
import pkg from "pg";
import crypto from "crypto";

const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

// Connexion PostgreSQL Render
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Fonction de hash SHA-256
function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

// ============================
// ROUTE LOGIN
// ============================
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT id, email, password FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Email inconnu" });
    }

    const user = result.rows[0];

    if (user.password !== hashPassword(password)) {
      return res.status(400).json({ error: "Mot de passe incorrect" });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================
// ROUTE PROTÉGÉE GET USER
// ============================
app.get("/user/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, email FROM users WHERE id = $1",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Utilisateur introuvable" });
    }

    res.json(result.rows[0]);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Backend prêt sur le port " + port));
