const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/authMiddle');
const checkRoleAuth = require('../middleware/roleAuth');
const {createUser, getUsers} = require('../controllers/userController')

router.get(`/`, checkAuth, checkRoleAuth(['admin']), getUsers);
router.post(`/`, createUser);

module.exports = router;