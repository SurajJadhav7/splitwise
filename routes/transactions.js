const express = require('express');
const { createTransaction, getTransactions, getTransaction, getTransactionsByGroup } = require('../controllers/transactions.js');

const router = express.Router();

router.get('/', getTransaction);

router.post('/', createTransaction);

module.exports = router;