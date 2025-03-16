const express = require('express');

const router = express.Router();

const { getUsersInRange } = require('../controllers/home.controller');

router.get('/users/:userId/range', getUsersInRange);

module.exports = router;
