const db = require('../db');

exports.createOrder = async (req, res) => {
  let connection;

  try {
    const { items, total, shipping } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Carrello vuoto' });
    }

    const normalizedTotal = Number(total);
    if (!Number.isFinite(normalizedTotal) || normalizedTotal < 0) {
      return res.status(400).json({ message: 'Totale non valido' });
    }

    connection = await db.getConnection();
    await connection.beginTransaction();

    const [orderResult] = await connection.query(
      'INSERT INTO orders (total, shipping_data) VALUES (?, ?)',
      [normalizedTotal, JSON.stringify(shipping ?? null)],
    );

    const orderId = orderResult.insertId;

    for (const item of items) {
      const productId = Number(item?.product?.id);
      const quantity = Number(item?.qty);
      const price = Number(item?.product?.price);

      if (!Number.isInteger(productId) || !Number.isInteger(quantity) || quantity <= 0) {
        throw new Error('Dati ordine non validi');
      }

      const [productRows] = await connection.query('SELECT quantity FROM products WHERE id = ?', [
        productId,
      ]);

      if (productRows.length === 0) {
        throw new Error(`Prodotto ${productId} non trovato`);
      }

      if (productRows[0].quantity < quantity) {
        throw new Error(`Quantita insufficiente per il prodotto ${productId}`);
      }

      await connection.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES (?, ?, ?, ?)`,
        [orderId, productId, quantity, price],
      );

      await connection.query('UPDATE products SET quantity = quantity - ? WHERE id = ?', [
        quantity,
        productId,
      ]);
    }

    await connection.commit();

    res.status(201).json({
      message: 'Ordine creato',
      orderId,
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }

    console.error(error);
    res.status(500).json({ message: error.message || 'Errore server' });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};
