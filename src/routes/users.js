const {createUser, getUsers} = require('../controllers/userController')
const express = require('express');
const router = express.Router();

router.get(`/`, getUsers);
router.post(`/`,createUser);

module.exports = router;