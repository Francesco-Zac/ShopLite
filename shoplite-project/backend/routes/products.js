const express = require('express');
const router = express.Router();
const { getAll, getById, create, update, remove } = require('../controllers/productsController');
const { verifyToken } = require('../middleware/authMiddleware');

// Rotte protette (solo admin)
router.post('/', verifyToken, create);
router.put('/:id', verifyToken, update);
router.delete('/:id', verifyToken, remove);

// Rotte pubbliche
router.get('/', getAll);
router.get('/:id', getById);

module.exports = router;
