const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ecommerce_db',
  port: Number(process.env.DB_PORT || 3306),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function ensureSchema() {
  const connection = await db.getConnection();
  try {
    // column quantity
    const [qtyColumns] = await connection.query("SHOW COLUMNS FROM products LIKE 'quantity'");
    if (qtyColumns.length === 0) {
      await connection.query('ALTER TABLE products ADD COLUMN quantity INT NOT NULL DEFAULT 0');
      console.log('Aggiunta colonna quantity a products');
    }

    // column category
    const [categoryColumns] = await connection.query("SHOW COLUMNS FROM products LIKE 'category'");
    if (categoryColumns.length === 0) {
      await connection.query(
        "ALTER TABLE products ADD COLUMN category VARCHAR(255) NOT NULL DEFAULT ''",
      );
      console.log('Aggiunta colonna category a products');
    }
  } catch (err) {
    console.error('Errore nel controllo dello schema DB:', err);
  } finally {
    connection.release();
  }
}

db.getConnection((err, connection) => {
  if (err) {
    console.error('Errore connessione DB:', err);
  } else {
    console.log('Connesso a MySQL!');
    connection.release();
  }
});

ensureSchema().catch((err) => console.error('Errore ensureSchema:', err));

module.exports = db;
