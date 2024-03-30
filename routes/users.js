const {User} = require('../models/user');
const express = require('express');
const router = express.Router();

router.get(`/`,async (req, res) => {
    const usersList = await User.find();
    if(!usersList){
        res.status(500).json({success: false});
    }
    res.send(usersList);
});

router.post(`/`, (req, res) => {
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
        status_user: req.body.status_user,
        isAdmin: req.body.isAdmin
    });
    user.save().then((createdUser=>{
        res.status(201).json(createdUser);
    })).catch((error)=>{
        res.status(500).json({
            error: error,
            success: false
        });
    });
});

module.exports = router;