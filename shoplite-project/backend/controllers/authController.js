const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

async function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username e password obbligatori' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM admins WHERE username = ?', [username]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Credenziali non valide' });
    }

    const admin = rows[0];

    const storedPassword = String(admin.password ?? '').trim();
    const sentPassword = String(password ?? '').trim();

    console.log('---------------- DEBUG LOGIN ----------------');
    console.log('Username richiesto:', username);
    console.log('Righe trovate:', rows.length);
    console.log('Password nel DB (primi 20 char):', storedPassword.substring(0, 20));
    console.log('Lunghezza password nel DB:', storedPassword.length);
    console.log('Inizia con $2? ', storedPassword.startsWith('$2'));
    console.log('Password inviata dal client:', sentPassword);

    let passwordValida = false;

    if (storedPassword.startsWith('$2')) {
      console.log('→ Ramo: bcrypt.compare');
      passwordValida = await bcrypt.compare(sentPassword, storedPassword);
      console.log('  bcrypt.compare risultato:', passwordValida);
    } else {
      console.log('→ Ramo: confronto in chiaro');
      passwordValida = storedPassword === sentPassword;
      console.log('  Confronto in chiaro risultato:', passwordValida);
      if (passwordValida) {
        console.log('[TEST] Login riuscito con password in chiaro');
      }
    }

    console.log('Risultato finale validazione:', passwordValida);
    console.log('---------------------------------------------');

    if (!passwordValida) {
      return res.status(401).json({ error: 'Credenziali non validee' });
    }

    // se siamo arrivati qui → password corretta (in chiaro o hashata)
    const token = jwt.sign({ id: admin.id, username: admin.username }, process.env.JWT_SECRET, {
      expiresIn: '8h',
    });

    res.json({ token, username: admin.username });
  } catch (err) {
    console.error('Errore nel login:', err);
    res.status(500).json({ error: 'Errore interno del server' });
  }
}

async function me(req, res) {
  res.json({ id: req.admin.id, username: req.admin.username });
}

module.exports = { login, me };
