const {Purchase} = require('../models/purchase');
const { User } = require('../models/user');
const mongoose = require('mongoose');

const getPurchases = async (req, res) => {
    const purchasesList = await Purchase.find();
    if(!purchasesList){
        res.status(500).json({success: false});
    }
    res.send(purchasesList);
};

const createPurchase = async (req, res) => {
    try {
        const { user_id, articles, totalPurchase, statusPurchase } = req.body;

        if (!mongoose.Types.ObjectId.isValid(user_id)) {
            return res.status(400).send("Invalid USER ID");
        }

        const existinguser = await User.findById(user_id);
        if (!existinguser) {
            return res.status(404).send("User not found");
        }

        const purchase = new Purchase({
            articles,
            totalPurchase,
            statusPurchase,
            dateCreated: new Date()
        });

        const savedpurchase = await purchase.save();
        res.status(201).send(savedpurchase);

    } catch (error) {
        console.error("Error creating purchase:", error);
        res.status(500).send("Internal server error");
    }
}

module.exports = { getPurchases, createPurchase };