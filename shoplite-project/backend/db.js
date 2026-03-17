const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'ecommerce_db',
  port: 3306,
});

db.getConnection((err, connection) => {
  if (err) {
    console.error('Errore connessione DB:', err);
  } else {
    console.log('Connesso a MySQL!');
    connection.release();
  }
});

module.exports = db;
