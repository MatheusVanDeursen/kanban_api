const express = require('express');
const columnController = require('../controllers/columnController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Protege todas as rotas de columns
router.use(authMiddleware);

router.get('/board', columnController.getBoard);
router.get('/', columnController.list);
router.post('/', columnController.create);
router.patch('/:id', columnController.update);
router.delete('/:id', columnController.delete);

module.exports = router;