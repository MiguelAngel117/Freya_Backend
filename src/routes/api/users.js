const express = require('express');
const router = express.Router();
const checkAuth = require('../../middleware/authMiddle');
const checkRoleAuth = require('../../middleware/roleAuth');
const { createUser, getUsers, getUserById, updateUser, deleteUser, sortUsers, searchUsersByName, updateAddress, createAddress} = require('../../controllers/userController');


router.get('/sort', checkAuth, checkRoleAuth(['admin']), sortUsers);
router.get('/search', searchUsersByName);

router.get('/', checkAuth, checkRoleAuth(['admin']),getUsers);
router.post('/', createUser);
router.get('/:id', checkAuth, checkRoleAuth(['admin']), getUserById);
router.put('/:id', checkAuth, checkRoleAuth(['admin','user']), updateUser);
router.put('/createAddress/:id', createAddress);
router.put('/updateAddress/:id', updateAddress);
router.delete('/:id', checkAuth, checkRoleAuth(['admin']), deleteUser);

module.exports = router;