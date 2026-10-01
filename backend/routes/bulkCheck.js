const express = require('express');
const router = express.Router();
const bulkController = require('../controllers/bulkController');

// POST /api/check-bulk
router.post('/check-bulk', bulkController.checkBulk);

module.exports = router;
