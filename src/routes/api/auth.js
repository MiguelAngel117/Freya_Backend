const {login, register, changeStatus, changePassword} = require('../../controllers/authController');
const express = require('express');
const router = express.Router();
const checkAuth = require('../../middleware/authMiddle');
const checkRoleAuth = require('../../middleware/roleAuth');

router.post('/login', login);
router.post('/register', register);
router.put('/:id', checkAuth, checkRoleAuth(['admin','user']), changeStatus);
router.put('/changePassword/:id', changePassword);

module.exports = router;