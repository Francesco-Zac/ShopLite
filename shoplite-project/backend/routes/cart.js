const express = require('express');
const router = express.Router();

const cartController = require('../controllers/cartController');

router.post('/orders', cartController.createOrder);

module.exports = router;