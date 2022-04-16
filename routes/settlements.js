const express = require('express');
const { getSettlement } = require('../controllers/settlements.js');

const router = express.Router();

router.get('/', getSettlement);

module.exports = router;