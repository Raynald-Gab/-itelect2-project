const express = require('express');
const { register, login } = require('../controllers/authController.js');

const router = express.Router();

// server.js mounts this router at /api/auth
router.post('/register', register);
router.post('/login', login);

module.exports = router;