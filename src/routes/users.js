const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/authMiddle');
const checkRoleAuth = require('../middleware/roleAuth');
const { createUser, getUsers, getUserById, updateUser, deleteUser, sortUsers } = require('../controllers/userController');

// Route for sorting users
router.get('/sort', checkAuth, checkRoleAuth(['admin']), sortUsers);

// Routes for CRUD operations
router.get('/', checkAuth, checkRoleAuth(['admin']), getUsers);
router.post('/', createUser);
router.get('/:id', checkAuth, checkRoleAuth(['admin']), getUserById);
router.put('/:id', checkAuth, checkRoleAuth(['admin']), updateUser);
router.delete('/:id', checkAuth, checkRoleAuth(['admin']), deleteUser);

module.exports = router;
