const User = require('../models/user');

const createUser = async (req, res) => {
    try {
        const user = new User({
            first_name: req.body.first_name,
            second_name: req.body.second_name,
            type_document: req.body.type_document,
            number_document: req.body.number_document,
            birth_day: req.body.birth_day,
            gender: req.body.gender,
            number_phone: req.body.number_phone,
            email: req.body.email,
            password: req.body.password
        });
        const existUser = await User.findOne({ email: req.body.email});
        if(existUser){
            res.status(400).send("USER ALREADY EXIST");
        }else{
            const savedUser = await User.create(req.body);
            res.status(201).send(savedUser);
        }
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).send("Internal server error");
    }
};

const getUsers = async (req, res) => {
    try {
        const usersList = await User.find();
        if(!usersList){
            res.status(500).json({success: false});
        }
        res.send(usersList); 
    } catch (error) {
        console.error("Error getUsers:", error);
        res.status(500).send("Error get users:");
    }
};

// Get a single user by ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            res.status(404).send("User not found");
        } else {
            res.send(user);
        }
    } catch (error) {
        console.error("Error getUserById:", error);
        res.status(500).send("Internal server error");
    }
};

// Update a user by ID
const updateUser = async (req, res) => {
    try {
        const data = {
            first_name: req.body.first_name,
            second_name: req.body.second_name,
            type_document: req.body.type_document,
            number_document: req.body.number_document,
            birth_day: req.body.birth_day,
            gender: req.body.gender,
            number_phone: req.body.number_phone,
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id, data, { new: true });
        if (!updatedUser) {
            res.status(404).send("User not found");
        } else {
            res.send(updatedUser);
        }
    } catch (error) {
        console.error("Error updateUser:", error);
        res.status(500).send("Internal server error");
    }
};

// Delete a user by ID
const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            res.status(404).send("User not found");
        } else {
            res.status(200).send(deletedUser);
        }
    } catch (error) {
        console.error("Error deleteUser:", error);
        res.status(500).send("Internal server error");
    }
};

// Sort users by a specific field
const sortUsers = async (req, res) => {
    try {
        const { sortBy } = req.query;
        const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
        const sortedUsers = await User.find().sort({ [sortBy]: sortOrder });
        res.send(sortedUsers);
    } catch (error) {
        console.error("Error sortUsers:", error);
        res.status(500).send("Internal server error");
    }
};

const searchUsersByName = async (req, res) => {
    try {
        const searchTerm = req.query.name_user;
        if (!searchTerm) {
            return res.status(400).send("Se requiere un término de búsqueda");
        }
        const matchedUsers = await User.find({ name_user: { $regex: searchTerm, $options: 'i' } });

        if (matchedUsers.length === 0) {
            return res.status(404).send("No se encontraron usuarios que coincidan con la búsqueda");
        }

        res.status(200).send(matchedUsers);
    } catch (error) {
        console.error("Error al buscar usuarios por nombre:", error);
        res.status(500).send("Error al buscar usuarios por nombre - Error interno del servidor");
    }
}

module.exports = { createUser, getUsers, getUserById, updateUser, deleteUser, sortUsers, searchUsersByName };
