const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const db     = require('../config/db');

async function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username e password obbligatori' });
  }

  try {
    const [rows] = await db.query(
      'SELECT * FROM admins WHERE username = ?',
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Credenziali non valide' });
    }

    const admin = rows[0];
    const valid = await bcrypt.compare(password, admin.password);

    if (!valid) {
      return res.status(401).json({ error: 'Credenziali non valide' });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token, username: admin.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore interno del server' });
  }
}

async function me(req, res) {
  res.json({ id: req.admin.id, username: req.admin.username });
}

module.exports = { login, me };
