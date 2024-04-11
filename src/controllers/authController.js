const userModel = require('../models/user');
const {encrypt, compare} = require('../helpers/handleBcrypt');
const { tokenSign } = require('../helpers/generateToken');

const login = async (req, res) =>{
    try {
        const {email, password} = req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).send("INVALID EMAIL FORMAT");
            return;
        }
        const user = await userModel.findOne({email: email.toUpperCase()});
        if(!user) {
            res.status(404).send("USER NOT FOUND");
            return;
        }
        const checkPassword = await compare(password, user.password);
        const tokenSession = await tokenSign(user)
        if(checkPassword){
            return res.status(200).send({
                data: user,
                tokenSession
            });
        }else{
            return res.status(409).send({
                error: 'INVALID PASSWORD'
            })
        }
    } catch (error) {
        console.error("Error login:", error);
        res.status(500).send("Internal server error");
    }
};

const register = async (req, res) =>{
    try {
        const {name_user, email, password} = req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).send("INVALID EMAIL FORMAT");
            return;
        }
        const findUser = await userModel.findOne({email: email.toUpperCase()});
        if(findUser) {
            res.status(404).send("USER ALREADY EXISTS");
            return;
        }
        const encryptedPass = await encrypt(password);
        const user = new userModel({
            name_user,
            email: email.toUpperCase(),
            password: encryptedPass,
            status_user: true
        });
        const savedUser = await user.save();
        res.status(201).send(savedUser);
    } catch (error) {
        console.error("Error register user:", error);
        res.status(500).send("Internal server error");
    }
};

module.exports = {login, register};