const express = require('express');
const { listUsers } = require('../controllers/authController.js');

const router = express.Router();

// server.js mounts this router at /api/users
router.get('/', listUsers);

module.exports = router;