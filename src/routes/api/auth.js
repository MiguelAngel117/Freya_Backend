const {login, register, changeStatus, changePassword, sendStatus, changePasswordSesion, changePass} = require('../../controllers/authController');
const express = require('express');
const router = express.Router();
const checkAuth = require('../../middleware/authMiddle');
const checkRoleAuth = require('../../middleware/roleAuth');

router.post('/login', login);
router.post('/register', register);
router.put('/:id', checkAuth, checkRoleAuth(['admin','user']), changeStatus);
router.get('/changePassLogin', changePasswordSesion);
router.put('/changePassword/:id', changePassword);
router.get('/verifyToken', checkAuth, sendStatus);

module.exports = router;