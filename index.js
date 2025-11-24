const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// === INSCRIPTION (pseudo + email + mdp) ===
app.post('/auth/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ error: 'Tous les champs requis' });

  const hash = await bcrypt.hash(password, 10);
  try {
    const result = await pool.query(
      'INSERT INTO users(username, email, password) VALUES($1, $2, $3) RETURNING id',
      [username, email.toLowerCase(), hash]
    );
    res.json({ success: true, userId: result.rows[0].id });
  } catch (e) {
    res.status(400).json({ error: 'Pseudo ou email déjà utilisé' });
  }
});

// === CONNEXION ===
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const { rows } = await pool.query('SELECT id, password FROM users WHERE email = $1', [email.toLowerCase()]);
  if (!rows[0] || !(await bcrypt.compare(password, rows[0].password))) {
    return res.status(401).json({ error: 'Mauvais identifiants' });
  }
  res.json({ success: true, userId: rows[0].id });
});

// === DÉBLOQUER CARTE ===
app.post('/api/unlock', async (req, res) => {
  const { userId, carteId } = req.body;
  await pool.query(
    `INSERT INTO collection(user_id, carte_id, quantite) VALUES($1, $2, 1)
     ON CONFLICT(user_id, carte_id) DO UPDATE SET quantite = collection.quantite + 1`,
    [userId, carteId]
  );
  res.json({ success: true });
});

// === CHARGER COLLECTION ===
app.get('/api/collection', async (req, res) => {
  const { userId } = req.query;
  const { rows } = await pool.query('SELECT carte_id, quantite FROM collection WHERE user_id = $1', [userId]);
  res.json(rows);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API Maximus TCG prête → port ${PORT}`));
