const {Sale} = require('../models/sale');
const express = require('express');
const { User } = require('../models/user');
const router = express.Router();
const mongoose = require('mongoose');

//obtener todas las ventas
router.get(`/`,async (req, res) => {
    const salesList = await Sale.find();
    if(!salesList){
        res.status(500).json({success: false});
    }
    res.send(salesList);
});

//Crear nueva venta
router.post(`/`, async (req, res) => {
    try {
        const { user_id, articles, totalSale, statusSale } = req.body;

        if (!mongoose.Types.ObjectId.isValid(user_id)) {
            return res.status(400).send("Invalid USER ID");
        }

        const existinguser = await User.findById(user_id);
        if (!existinguser) {
            return res.status(404).send("User not found");
        }

        const sale = new Sale({
            articles,
            totalSale,
            statusSale,
            dateCreated: new Date()
        });

        const savedSale = await sale.save();
        res.status(201).send(savedSale);

    } catch (error) {
        console.error("Error creating Sale:", error);
        res.status(500).send("Internal server error");
    }
});

module.exports = router;