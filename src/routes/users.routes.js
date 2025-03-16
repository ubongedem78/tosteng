const express = require('express');
const {
  getAllUsers,
  getUserByIdorEmail,
} = require('../controllers/user.controller');

const router = express.Router();

router.get('/users', getAllUsers);

router.get('/users/:id', getUserByIdorEmail);

module.exports = router;
