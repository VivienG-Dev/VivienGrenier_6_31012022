const express = require('express');
const router = express.Router();

// Importation du controller "user"
const userCtrl = require('../controllers/user');

// Routes pour s'inscrire et se connecter
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;