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

router.get('/sorted', getStoresSortedByName);
router.get('/search', searchStoresByName);
router.get('/', getStores);
router.get('/:id', getStoreById);

router.post('/', createStore);
router.put('/:id', updateStoreById);

router.delete('/:id', deleteStoreById);

module.exports = router;
//module.exports = (app) => app.use("/api/v1/stores", router);