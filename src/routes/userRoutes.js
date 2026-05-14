const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/signup', userController.register);
router.post('/login', userController.login);
router.get('/me', authMiddleware, userController.getMe);
router.post('/auth/google', userController.googleLogin);

module.exports = router;