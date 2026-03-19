require('dotenv').config({ path: require('path').join(__dirname, '.env'), quiet: true });

const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

const DEFAULT_ADMIN = {
  username: process.env.ADMIN_USERNAME || 'admin',
  password: process.env.ADMIN_PASSWORD || 'admin123',
};

const SAMPLE_PRODUCTS = [
  {
    name: 'Notebook Pro 14',
    description: 'Notebook leggero da 14 pollici per studio e lavoro.',
    price: 1199.99,
    quantity: 12,
    imageUrl:
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80',
    category: 'Laptop',
  },
  {
    name: 'Auricolari Pulse',
    description: 'Auricolari wireless con cancellazione del rumore.',
    price: 149.9,
    quantity: 30,
    imageUrl:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
    category: 'Audio',
  },
  {
    name: 'Smartwatch Fit X',
    description: 'Smartwatch con monitoraggio sportivo e notifiche smart.',
    price: 219,
    quantity: 18,
    imageUrl:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
    category: 'Wearable',
  },
];

let pool;

function getDbConfig(includeDatabase = true) {
  const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: Number(process.env.DB_PORT || 3306),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: false,
  };

  if (includeDatabase) {
    config.database = process.env.DB_NAME || 'ecommerce_db';
  }

  return config;
}

function getPool() {
  if (!pool) {
    throw new Error('Database non inizializzato. Esegui initDatabase() prima di usare il pool.');
  }

  return pool;
}

async function createDatabaseIfMissing() {
  const adminConnection = await mysql.createConnection(getDbConfig(false));

  try {
    const databaseName = process.env.DB_NAME || 'ecommerce_db';
    await adminConnection.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\``);
  } finally {
    await adminConnection.end();
  }
}

async function createTables() {
  const db = getPool();

  await db.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT NULL,
      price DECIMAL(10, 2) NOT NULL,
      quantity INT NOT NULL DEFAULT 0,
      image_url TEXT NULL,
      category VARCHAR(255) NOT NULL DEFAULT '',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      total DECIMAL(10, 2) NOT NULL,
      shipping_data JSON NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id INT NOT NULL,
      product_id INT NULL,
      quantity INT NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_order_items_order
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      CONSTRAINT fk_order_items_product
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
    )
  `);
}

async function seedAdmin() {
  const db = getPool();
  const [rows] = await db.query('SELECT id FROM admins WHERE username = ?', [DEFAULT_ADMIN.username]);

  if (rows.length > 0) {
    return;
  }

  const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN.password, 10);
  await db.query('INSERT INTO admins (username, password) VALUES (?, ?)', [
    DEFAULT_ADMIN.username,
    hashedPassword,
  ]);

  console.log(`Admin iniziale creato: ${DEFAULT_ADMIN.username}`);
}

async function seedProducts() {
  const db = getPool();
  const [rows] = await db.query('SELECT COUNT(*) AS total FROM products');

  if (rows[0].total > 0) {
    return;
  }

  for (const product of SAMPLE_PRODUCTS) {
    await db.query(
      `INSERT INTO products (name, description, price, quantity, image_url, category)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        product.name,
        product.description,
        product.price,
        product.quantity,
        product.imageUrl,
        product.category,
      ],
    );
  }

  console.log(`Seed prodotti completato: ${SAMPLE_PRODUCTS.length} prodotti inseriti`);
}

async function initDatabase() {
  await createDatabaseIfMissing();

  pool = mysql.createPool(getDbConfig(true));

  await pool.query('SELECT 1');
  await createTables();
  await seedAdmin();
  await seedProducts();

  console.log(`Database pronto: ${process.env.DB_NAME || 'ecommerce_db'}`);
}

async function query(sql, params) {
  return getPool().query(sql, params);
}

async function getConnection() {
  return getPool().getConnection();
}

module.exports = {
  getConnection,
  initDatabase,
  query,
};
