const db = require('../db');

// Mappa colonne DB → campi frontend
function mapProduct(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description || '',
    price: parseFloat(row.price),
    quantity: row.quantity != null ? row.quantity : 0,
    imageUrl: row.image_url || '',
    category: row.category || '',
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
    const query = `INSERT INTO products (name, description, price, quantity, image_url, category) VALUES (?, ?, ?, ?, ?, ?)`;
    const params = [
      name,
      description ?? null,
      price,
      quantity ?? 0,
      imageUrl ?? null,
      category ?? '',
    ];

    const [result] = await db.query(query, params);
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [result.insertId]);
    res.status(201).json(mapProduct(rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore nella creazione del prodotto' });
  }
}

async function update(req, res) {
  const { name, description, price, quantity, imageUrl, category } = req.body;

  try {
    const [existingRows] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (existingRows.length === 0) {
      return res.status(404).json({ error: 'Prodotto non trovato' });
    }

    const existing = mapProduct(existingRows[0]);
    const updated = {
      name: name ?? existing.name,
      description: description ?? existing.description,
      price: price ?? existing.price,
      quantity: quantity ?? existing.quantity,
      imageUrl: imageUrl ?? existing.imageUrl,
      category: category ?? existing.category,
    };

    if (!updated.name || updated.price == null) {
      return res.status(400).json({ error: 'Nome e prezzo sono obbligatori' });
    }

    const [result] = await db.query(
      `UPDATE products
       SET name = ?, description = ?, price = ?, quantity = ?, image_url = ?, category = ?
       WHERE id = ?`,
      [
        updated.name,
        updated.description ?? null,
        updated.price,
        updated.quantity ?? 0,
        updated.imageUrl ?? null,
        updated.category ?? '',
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
    // Rimuoviamo prima le eventuali righe ordini collegate per evitare errori FK.
    await db.query('DELETE FROM order_items WHERE product_id = ?', [req.params.id]);

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
