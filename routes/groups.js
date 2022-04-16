const express = require('express');
const { getGroups, createGroup, getGroup } = require('../controllers/groups.js');

const router = express.Router();

router.get('/:id', getGroup);

router.get('/', getGroups);

router.post('/', createGroup);

module.exports = router;