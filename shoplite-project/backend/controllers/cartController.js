const db = require('../db');

exports.createOrder = async (req, res) => {
  try {
    const { items, total } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Carrello vuoto' });
    }

    const [orderResult] = await db.query(
      'INSERT INTO orders (total) VALUES (?)',
      [total]
    );

    const orderId = orderResult.insertId;

    for (const item of items) {
      await db.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES (?, ?, ?, ?)`,
        [
          orderId,
          item.product.id,
          item.qty,
          item.product.price
        ]
      );
    }

    res.status(201).json({
      message: 'Ordine creato',
      orderId
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Errore server' });
  }
};