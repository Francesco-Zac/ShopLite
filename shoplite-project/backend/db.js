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
  {
    name: 'Monitor Vision 27',
    description: 'Monitor IPS da 27 pollici con risoluzione QHD e refresh rate a 144Hz.',
    price: 329.99,
    quantity: 14,
    imageUrl:
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80',
    category: 'Monitor',
  },
  {
    name: 'Mouse Air Mini',
    description: 'Mouse wireless ergonomico con batteria ricaricabile e design compatto.',
    price: 39.9,
    quantity: 45,
    imageUrl:
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=900&q=80',
    category: 'Accessori',
  },
  {
    name: 'Tastiera Mech TKL',
    description: 'Tastiera meccanica tenkeyless con switch lineari e retroilluminazione bianca.',
    price: 89.5,
    quantity: 22,
    imageUrl:
      'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=900&q=80',
    category: 'Accessori',
  },
  {
    name: 'Tablet Nova 11',
    description: 'Tablet da 11 pollici ideale per intrattenimento, note e navigazione.',
    price: 459,
    quantity: 16,
    imageUrl:
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=900&q=80',
    category: 'Tablet',
  },
  {
    name: 'Speaker Room One',
    description: 'Cassa Bluetooth compatta con audio bilanciato e autonomia fino a 12 ore.',
    price: 79.99,
    quantity: 28,
    imageUrl:
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=900&q=80',
    category: 'Audio',
  },
  {
    name: 'Webcam Stream HD',
    description: 'Webcam Full HD con autofocus e microfono integrato per call e streaming.',
    price: 64.9,
    quantity: 19,
    imageUrl:
      'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=900&q=80',
    category: 'Video',
  },
  {
    name: 'SSD Flash 1TB',
    description: 'Unita SSD esterna USB-C da 1TB per backup veloci e trasporto file.',
    price: 109.99,
    quantity: 34,
    imageUrl:
      'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=900&q=80',
    category: 'Storage',
  },
  {
    name: 'Power Bank Volt 20K',
    description: 'Power bank da 20000 mAh con ricarica rapida USB-C e doppia porta.',
    price: 49.99,
    quantity: 40,
    imageUrl:
      'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=900&q=80',
    category: 'Energia',
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
  const [rows] = await db.query('SELECT name FROM products');
  const existingNames = new Set(rows.map((row) => row.name));
  let insertedCount = 0;

  for (const product of SAMPLE_PRODUCTS) {
    if (existingNames.has(product.name)) {
      continue;
    }

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

    insertedCount += 1;
  }

  console.log(
    `Seed prodotti completato: ${insertedCount} nuovi prodotti inseriti, totale catalogo seed ${SAMPLE_PRODUCTS.length}`,
  );
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
