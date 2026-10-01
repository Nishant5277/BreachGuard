const express = require('express');
const router = express.Router();
const passwordController = require('../controllers/passwordController');

// POST /api/check-password
router.post('/check-password', passwordController.checkPassword);

module.exports = router;
