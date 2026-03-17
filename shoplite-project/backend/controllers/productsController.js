const db = require('../db');

// Mappa colonne DB → campi frontend
function mapProduct(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: parseFloat(row.price),
    quantity: row.quantity,
    imageUrl: row.image_url,
    category: row.category,
  };
}

async function getAll(req, res) {
  try {
    const [rows] = await db.query('SELECT * FROM products ORDER BY created_at DESC');
    res.json(rows.map(mapProduct));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore nel recupero dei prodotti' });
  }
}

async function getById(req, res) {
  try {
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Prodotto non trovato' });
    }
    res.json(mapProduct(rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore nel recupero del prodotto' });
  }
}

async function create(req, res) {
  const { name, description, price, quantity, imageUrl, category } = req.body;

  if (!name || price == null) {
    return res.status(400).json({ error: 'Nome e prezzo sono obbligatori' });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO products (name, description, price, quantity, image_url, category)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, description ?? null, price, quantity ?? 0, imageUrl ?? null, category ?? null],
    );
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [result.insertId]);
    res.status(201).json(mapProduct(rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore nella creazione del prodotto' });
  }
}

async function update(req, res) {
  const { name, description, price, quantity, imageUrl, category } = req.body;

  if (!name || price == null) {
    return res.status(400).json({ error: 'Nome e prezzo sono obbligatori' });
  }

  try {
    const [result] = await db.query(
      `UPDATE products
       SET name = ?, description = ?, price = ?, quantity = ?, image_url = ?, category = ?
       WHERE id = ?`,
      [
        name,
        description ?? null,
        price,
        quantity ?? 0,
        imageUrl ?? null,
        category ?? null,
        req.params.id,
      ],
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Prodotto non trovato' });
    }
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    res.json(mapProduct(rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore nella modifica del prodotto' });
  }
}

async function remove(req, res) {
  try {
    const [result] = await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Prodotto non trovato' });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore nella cancellazione del prodotto' });
  }
}

module.exports = { getAll, getById, create, update, remove };
