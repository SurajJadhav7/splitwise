const express = require('express');
const { getUsers, createUser, getUser } = require('../controllers/users.js');

const router = express.Router();

router.get('/:id', getUser);

router.get('/', getUsers);

router.post('/', createUser);

module.exports = router;