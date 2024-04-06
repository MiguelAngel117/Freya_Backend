const {encrypt, compare} = require('../helpers/handleBcrypt');
const User = require('../models/user');
const express = require('express');
const router = express.Router();

router.post('/login', async (req, res) =>{
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user) {
            res.status(404).send("USER NOT FOUND");
            return;
        }
        const checkPassword = await compare(password, user.password);
        if(checkPassword){
            res.send({
                data: user
            });
            return;
        }else{
            res.status(409).send({
                error: 'INVALID PASSWORD'
            })
            return;
        }
    } catch (error) {
        console.error("Error login:", error);
        res.status(500).send("Internal server error");
    }
});

router.post('/register', async (req, res) =>{
    try {
        const {name_user, email, password} = req.body;
        const findUser = await User.findOne({email});
        if(findUser) {
            res.status(404).send("USER ALREADY EXISTS");
            return;
        }
        const encryptedPass = await encrypt(password);
        const user = new User({
            name_user,
            email,
            password: encryptedPass,
            status_user: true,
            isAdmin: false
        });
        const savedUser = await user.save();
        res.status(201).send(savedUser);
    } catch (error) {
        console.error("Error register user:", error);
        res.status(500).send("Internal server error");
    }
});
module.exports = router;