const express = require('express');
const cardController = require('../controllers/cardController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Protege todas as rotas de cards
router.use(authMiddleware);

router.post('/', cardController.create);
router.patch('/:id/move', cardController.move);
router.patch('/:id', cardController.update);
router.delete('/:id', cardController.delete);

module.exports = router;