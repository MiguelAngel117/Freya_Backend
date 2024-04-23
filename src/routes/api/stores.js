const express = require('express');
const router = express.Router();
const { 
    getStores, 
    getStoreById, 
    createStore, 
    updateStoreById, 
    deleteStoreById, 
    getStoresSortedByName, 
    searchStoresByName 
} = require('../../controllers/storesController');
const checkAuth = require('../../middleware/authMiddle');
const checkRoleAuth = require('../../middleware/roleAuth');

router.get('/sorted', checkAuth, checkRoleAuth(['admin']), getStoresSortedByName);
router.get('/search',checkAuth, checkRoleAuth(['admin']), searchStoresByName);
router.get('/', checkAuth, checkRoleAuth(['admin']), getStores);
router.get('/:id', checkAuth, checkRoleAuth(['admin']), getStoreById);

router.post('/', checkAuth, checkRoleAuth(['admin']), createStore);
router.put('/:id', checkAuth, checkRoleAuth(['admin']), updateStoreById);

router.delete('/:id',checkAuth, checkRoleAuth(['admin']), deleteStoreById);

module.exports = router;