const User = require('../models/user');
const express = require('express');
const router = express.Router();

router.get(`/`,async (req, res) => {
    const usersList = await User.find();
    if(!usersList){
        res.status(500).json({success: false});
    }
    res.send(usersList);
});

router.post(`/`, async (req, res) => {
    try {
        const user = new User({
            name_user: req.body.name_user,
            type_document: req.body.type_document,
            number_document: req.body.number_document,
            address: req.body.address,
            city: req.body.city,
            country: req.body.country,
            department: req.body.department,
            number_phone: req.body.number_phone,
            email: req.body.email,
            password: req.body.password,
            status_user: true,
            isAdmin: false
        });
    
        const savedUser = await user.save();
        res.status(201).send(savedUser);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).send("Internal server error");
    }
});

module.exports = router;