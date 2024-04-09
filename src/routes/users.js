const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/authMiddle');
const checkRoleAuth = require('../middleware/roleAuth');
const { createUser, getUsers, getUserById, updateUser, deleteUser, sortUsers, searchUsersByName } = require('../controllers/userController');


router.get('/sort', checkAuth, checkRoleAuth(['admin']), sortUsers);
router.get('/search', searchUsersByName);

router.get('/', checkAuth, checkRoleAuth(['admin']),getUsers);
router.post('/', createUser);
router.get('/:id', checkAuth, checkRoleAuth(['admin']), getUserById);
router.put('/:id', checkAuth, checkRoleAuth(['admin']), updateUser);
router.delete('/:id', checkAuth, checkRoleAuth(['admin']), deleteUser);

module.exports = (app) => app.use("/api/v1/users", router);