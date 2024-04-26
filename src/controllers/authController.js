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
            res.status(400).send("USER NOT FOUND");
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
        const {email, password} = req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).send("INVALID EMAIL FORMAT");
            return;
        }
        const findUser = await userModel.findOne({email: email.toUpperCase()});
        if(findUser) {
            res.status(400).send("USER ALREADY EXISTS");
            return;
        }
        const encryptedPass = await encrypt(password);
        const user = {
            first_name: req.body.first_name,
            second_name: req.body.second_name,
            type_document: req.body.type_document,
            number_document: req.body.number_document,
            birth_day: req.body.birth_day,
            gender: req.body.gender,
            number_phone: req.body.number_phone,
            email: email.toUpperCase(),
            password: encryptedPass
        };
        const savedUser = await userModel.create(user);
        res.status(201).send(savedUser);
    } catch (error) {
        console.error("Error register user:", error);
        res.status(500).send("Internal server error");
    }
};

const changeStatus = async(req, res) =>{
    try {
        const id = req.params.id;
        if(id.length === 24){
            const user = await userModel.findByIdAndUpdate(id, {status_user: false}, { new: true });
            if (!user) {
                return res.status(404).send("User not found to update");
            }
            res.status(200).send(user.status_user);
        }else{
            res.status(400).send("INCOMPLETE ID");
        }
    } catch (error) {
        res.status(500).send("Error updating user by ID - Internal Server Error");
    }
}

const changePassword = async (req, res) => {
    try {
        const id = req.params.id;
        if(id.length === 24){
            const user = await userModel.findById(id);
            const checkPassword = await compare(req.body.oldPassword, user.password);
            if(checkPassword){
                const newPassword = await encrypt(req.body.newPassword);
                const userUp = await userModel.findByIdAndUpdate(id, {password: newPassword}, { new: true });
                if (!user) {
                    return res.status(404).send("User not found to update");
                }
                res.status(200).send(userUp);
            }else{
                res.status(400).send("THE NEW PASSWORD DOES NOT MATCH THE OLD ONE");
            }
            
        }else{
            res.status(400).send("INCOMPLETE ID");
        }
    } catch (error) {
        res.status(500).send("Error updating user by ID - Internal Server Error");
    }
}

module.exports = {login, register, changeStatus, changePassword};