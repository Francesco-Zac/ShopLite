require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

// middleware
app.use(
  cors({
    origin: true, // in dev permettiamo qualsiasi origine (localhost / port test)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);
app.use(express.json());

// import delle rotte
const productsRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const authRoutes = require('./routes/auth');

// collegamento rotte
app.use('/api/products', productsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/auth', authRoutes);

// avvio server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
