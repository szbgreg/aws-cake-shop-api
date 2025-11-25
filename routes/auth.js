var express = require('express');
var router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken, requireAdmin } = require('../middleware/jwt');

router.post('/login', authController.login);
router.post('/register', authController.register);

router.get('/users', authenticateToken, requireAdmin, authController.getAllUsers);
router.get('/users/:id', authenticateToken, requireAdmin, authController.getUserForEdit);
router.put('/users/:id/edit', authenticateToken, requireAdmin, authController.updateUser);


module.exports = router;