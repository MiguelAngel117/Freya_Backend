const {login, register, changeStatus, changePassword} = require('../../controllers/authController');
const express = require('express');
const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.put('/:id', changeStatus);
router.put('/changePassword/:id', changePassword);

module.exports = router;