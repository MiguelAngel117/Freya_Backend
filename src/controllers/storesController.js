const storeModel = require('../models/store');

const createStore = async (req, res) =>{
    try {
        const existingStore = await storeModel.findOne({ address: req.body.address });
        if (existingStore) {
            return res.status(400).send("A store with the same address already exists");
        }
        const create = await storeModel.create(req.body);
        res.status(201).send(create);
    } catch (error) {
        console.error("Error creating store:", error);
        res.status(500).send("Error creating store - Internal Server Error");
    }
}

const getStores = async (req,res) =>{
    try {
        const listStores = await storeModel.find();
        if(listStores.length === 0){
            res.status(200).send("NO STORES REGISTERED");
            return;
        }
        res.status(200).send(listStores);
    } catch (error) {
        console.error("Error getting stores:", error);
        res.status(500).send("Error getting stores - Internal Server Error");
    }
}

const getStoreById = async (req, res) => {
    try {
        const id = req.params.id;
        if(id.length === 24){
            const store = await storeModel.findById(req.params.id);
            if (!store) {
                res.status(404).send("Store not found");
                return;
            }
            res.status(200).send(store);
        }else{
            res.status(400).send("INCOMPLETE ID");
        }
    } catch (error) {
        console.error("Error getting store by ID:", error);
        res.status(500).send("Error getting store by ID - Internal Server Error");
    }
}

const updateStoreById = async (req, res) => {
    try {
        const id = req.params.id;
        if(id.length === 24){
            const updatedStore = await storeModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updatedStore) {
                res.status(404).send("Store not found to update");
                return;
            }
            res.status(200).send(updatedStore);
        }else{
            res.status(400).send("INCOMPLETE ID");
        }
    } catch (error) {
        console.error("Error updating store by ID:", error);
        res.status(500).send("Error updating store by ID - Internal Server Error");
    }
}

const deleteStoreById = async (req, res) => {
    try {
        const id = req.params.id;
        if(id.length === 24){
            const deletedStore = await storeModel.findByIdAndDelete(req.params.id);
            if (!deletedStore) {
                res.status(404).send("Store not found to delete");
                return;
            }
            res.status(200).send("Store deleted successfully");
        }else{
            res.status(400).send("INCOMPLETE ID");
        }
        
    } catch (error) {
        console.error("Error deleting store by ID:", error);
        res.status(500).send("Error deleting store by ID - Internal Server Error");
    }
}


const getStoresSortedByName = async (req, res) => {
    try {
        const sortedStores = await storeModel.find().sort({ name_store: 1 });
        if (sortedStores.length === 0) {
            res.status(200).send("NO STORES REGISTERED");
            return;
        }
        res.status(200).send(sortedStores);
    } catch (error) {
        console.error("Error getting stores sorted by name:", error);
        res.status(500).send("Error getting stores sorted by name - Internal Server Error");
    }
}

const searchStoresByName = async (req, res) => {
    try {
        const searchTerm = req.query.name_store;
        if (!searchTerm) {
            res.status(400).send("A search term is required");
            return;
        }
        const matchedStores = await storeModel.find({ name_store: { $regex: searchTerm, $options: 'i' } });
        if (matchedStores.length === 0) {
            res.status(404).send("No stores found matching the search");
            return;
        }
        res.status(200).send(matchedStores);
    } catch (error) {
        console.error("Error searching stores by name:", error);
        res.status(500).send("Error searching stores by name - Internal Server Error");
    }
}

module.exports = { 
    createStore, 
    getStores, 
    getStoreById, 
    updateStoreById, 
    deleteStoreById, 
    getStoresSortedByName, 
    searchStoresByName 
};
