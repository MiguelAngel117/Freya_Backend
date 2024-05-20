const User = require('../models/user');

const createUser = async (req, res) => {
    try {
        const user = new User({
            first_name: req.body.first_name,
            second_name: req.body.second_name,
            type_document: req.body.type_document,
            number_document: req.body.number_document,
            gender: req.body.gender,
            number_phone: req.body.number_phone, 
            shiping_address: req.body.shiping_address,
            email: req.body.email,
            role: ''
        });
        const savedUser = await User.create(user);
        res.status(201).send(savedUser);
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

const updateUser = async (req, res) => {
    try {
        const data = {
            first_name: req.body.first_name,
            second_name: req.body.second_name,
            type_document: req.body.type_document,
            number_document: req.body.number_document,
            birth_day: req.body.birth_day,
            gender: req.body.gender,
            number_phone: req.body.number_phone
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

const createAddress = async (req, res) => {
    const { id } = req.params;

    try {
        const usuario = await User.findByIdAndUpdate(
            id,
            { $push: { shiping_address: req.body } },
            { new: true }
        );
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        return res.status(201).json({ message: 'Dirección creada correctamente', usuario });
    } catch (error) {
        console.error('Error al crear la dirección:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const updateAddress = async (req, res) => {
    const { id } = req.params;
    const { id_address, department, municipality, address, neighborhood, aditional_info, name_addressee, number_phone } = req.body;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const direccionIndex = user.shiping_address.findIndex(dir => dir._id.toString() === id_address);

        if (direccionIndex === -1) {
            return res.status(404).json({ error: 'Dirección no encontrada' });
        }

        user.shiping_address[direccionIndex] = {
            _id: id_address,
            department,
            municipality,
            address,
            neighborhood,
            aditional_info,
            name_addressee,
            number_phone
        };

        await user.save();

        return res.status(200).json({ message: 'Dirección actualizada correctamente', user });
    } catch (error) {
        console.error('Error al actualizar la dirección:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const deleteAddress = async (req, res) => {
    const { id } = req.params;
    const { id_address } = req.body;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const direccionIndex = user.shiping_address.findIndex(dir => dir._id.toString() === id_address);

        if (direccionIndex === -1) {
            return res.status(404).json({ error: 'Dirección no encontrada' });
        }

        user.shiping_address.splice(direccionIndex, 1);

        await user.save();

        return res.status(200).json({ message: 'Dirección eliminada correctamente', user });
    } catch (error) {
        console.error('Error al eliminar la dirección:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};

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

module.exports = { createUser, getUsers, getUserById, updateUser, deleteUser, sortUsers, searchUsersByName, updateAddress, createAddress, deleteAddress};
